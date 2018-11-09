import {Component, OnInit} from '@angular/core';
import {ItemFieldConfigHttpService} from 'src/app/shared/service/http/item-field-config-http.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {forkJoin, Observable} from 'rxjs';
import {first, map, startWith, switchMap} from 'rxjs/operators';
import {AppProperties} from 'src/app/shared/domain/app-properties';
import {ItemFieldConfig} from 'src/app/shared/domain/item-field-config';
import {FieldConfigHttpService} from 'src/app/shared/service/http/field-config-http.service';
import {LanguageHttpService} from 'src/app/shared/service/http/language-http.service';
import {Language} from 'src/app/shared/domain/language';
import {ProgressBarService} from 'src/app/shared/service/progress-bar.service';
import {ItemHttpService} from '../../../shared/service/http/item-http.service';
import {FieldConfig} from 'src/app/shared/domain/field-config';
import {InstructionTypeInputConfigHttpService} from 'src/app/shared/service/http/instruction-type-input-config-http.service';
import {Item} from 'src/app/shared/domain/item';
import {SaveMandatoryDataDto} from 'src/app/shared/dto/save-mandatory-data.dto';
import {MandatoryTranslationsHttpService} from 'src/app/shared/service/http/mandatory-translations-http.service';
import {ItemManager} from 'src/app/shared/utils/item.manager';
import {MessageService} from 'src/app/shared/service/message.service';
import {DeleteMandatoryDataDto} from 'src/app/shared/dto/delete-mandatory-data.dto';
import {MandatoryTranslationsService} from '../../../shared/service/mandatory-translations.service';
import {FormControl} from '@angular/forms';
import {MandatoryFieldsService} from '../../../shared/service/mandatory-fields.service';
import {MatDialog} from '@angular/material';
import {MultipleEditDialogComponent} from '../multiple-edit-dialog/multiple-edit-dialog.component';

@Component({
  selector: 'app-item-field-config-list',
  templateUrl: './item-field-config-list.component.html',
  styleUrls: ['./item-field-config-list.component.css']
})
export class ItemFieldConfigListComponent implements OnInit {
  itemFieldConfigNameInput = new FormControl();
  itemFieldConfigs: ItemFieldConfig[] = [];
  filteredItemFieldConfigs: Observable<ItemFieldConfig[]>;
  instructionsFields = {};
  instructionLanguages = {};
  instructionsFieldCofigsMap = {};
  selectedItemFieldConfig: ItemFieldConfig = ItemFieldConfig.default(FieldConfig.default());
  selectedInstructionFieldConfigs: FieldConfig[] = [];
  selectedInstructionLanguages: Language[] = [];
  item: Item;

  constructor(
    private instructionConfigHttpService: InstructionTypeInputConfigHttpService,
    private mandatoryTranslationsService: MandatoryTranslationsService,
    private itemFieldConfigHttpService: ItemFieldConfigHttpService,
    private fieldConfigHttpService: FieldConfigHttpService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private progressBarService: ProgressBarService,
    private itemHttpService: ItemHttpService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.progressBarService.show();
    const itemId = this.route.snapshot.paramMap.get(AppProperties.REQUEST_PARAM_ITEM_ID);
    forkJoin(
      this.itemFieldConfigHttpService.getInstructionsByItemId(itemId),
      this.fieldConfigHttpService.getInstructionsFields(),
      this.fieldConfigHttpService.getInstructionsFieldConfigsMap(),
      this.itemHttpService.getByIdWithoutItemFieldConfig(itemId),
      this.instructionConfigHttpService.getInstructionsLanguages()
    ).subscribe((result) => {
      // result[0] = item field configs, result[1] = instructions fields, result[2] = instructions field configs map,
      // result[3] = item, result[4] = instruction languages
      this.itemFieldConfigs = result[0];
      this.instructionsFields = result[1];
      this.instructionsFieldCofigsMap = result[2];
      this.item = result[3];
      this.instructionLanguages = result[4];
      this.initFilter();
      this.progressBarService.hide();
    }, (error) => this.progressBarService.hide());
  }

  initFilter() {
    this.filteredItemFieldConfigs = this.itemFieldConfigNameInput.valueChanges.pipe(
      startWith<string>(''),
      map((fieldConfigName: string) => {
        return fieldConfigName ? this._filter(fieldConfigName) : this.itemFieldConfigs.slice();
      })
    );
  }

  multipleEdit() {
    this.dialog.open(MultipleEditDialogComponent, {
      width: '1300px',
      data: {
        selectedItemFieldConfig: this.selectedItemFieldConfig,
        itemFieldConfigs: this.itemFieldConfigs,
        selectedInstructionFieldConfigs: this.selectedInstructionFieldConfigs,
        selectedInstructionLanguages: this.selectedInstructionLanguages
      }
    });
  }

  private _filter(fieldConfigName: string): ItemFieldConfig[] {
    const inLowerCase = fieldConfigName.trim().toLowerCase();
    return this.itemFieldConfigs.filter(itemFieldConfig => itemFieldConfig.fieldConfig.name.toLowerCase().indexOf(inLowerCase) > -1);
  }

  select(itemFieldConfig: ItemFieldConfig) {
    this.selectedItemFieldConfig = itemFieldConfig;
    this.selectedInstructionFieldConfigs = this.getSelectedInstructionFieldConfigs();
    this.selectedInstructionLanguages = this.getSelectedInstructionLanguages();
  }

  getSelectedInstructionFieldConfigs(): FieldConfig[] {
    const instructionFields = this.instructionsFields[this.selectedItemFieldConfig.fieldConfig.type];
    if (instructionFields && instructionFields.length > 0) {
      let result: FieldConfig[] = [];
      instructionFields.forEach(fieldName => result.push(this.instructionsFieldCofigsMap[fieldName]));
      return result;
    }
    return [];
  }

  getSelectedInstructionLanguages() {
    const languages = this.instructionLanguages[this.selectedItemFieldConfig.fieldConfig.type];
    return languages && languages.length > 0 ? languages : [];
  }

  getItemFieldConfigsWithNewData() {
    return this.itemFieldConfigs.filter(fieldConfig => fieldConfig.hasNewMandatoryData);
  }

  getItemFieldConfigsWithSelectedData() {
    return this.itemFieldConfigs.filter(fieldConfig => fieldConfig.hasSelectedMandatoryData);
  }

  getItemNumber(): string {
    return ItemManager.getItemFieldValue(this.item, AppProperties.FIELD_D2COMM_ITEM_NUMBER);
  }

  saveForCurrentTranslations() {
    this.mandatoryTranslationsService.save(this.getItemFieldConfigsWithNewData());
  }

  saveForCurrentFields() {
    this.mandatoryFieldsService.save(this.getItemFieldConfigsWithNewData());
  }

  saveForItemNumberTranslations(itemNumbers?: string[]) {
    this.mandatoryTranslationsService.saveForItemNumbers(this.getItemFieldConfigsWithNewData(), this.getItemNumber(), itemNumbers);
  }

  saveForItemNumberFields(itemNumbers?: string[]) {
    this.mandatoryFieldsService.saveForItemNumbers(this.getItemFieldConfigsWithNewData(), this.getItemNumber(), itemNumbers);
  }

  deleteTranslation(deleteOptions?: {}) {
    this.mandatoryTranslationsService.delete(this.getItemFieldConfigsWithSelectedData(), this.getItemNumber(), deleteOptions);
  }

  deleteFields(deleteOptions?: {}) {
    this.mandatoryFieldsService.delete(this.getItemFieldConfigsWithSelectedData(), this.getItemNumber(), deleteOptions);
  }
}
