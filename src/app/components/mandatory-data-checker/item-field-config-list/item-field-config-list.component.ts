import {Component, OnInit} from '@angular/core';
import {ProgressBarService} from '../../../shared/service/progress-bar.service';
import {ActivatedRoute} from '@angular/router';
import {AppProperties} from '../../../shared/domain/app-properties';
import {forkJoin, Observable} from 'rxjs';
import {ItemFieldConfigHttpService} from '../../../shared/service/http/item-field-config-http.service';
import {ItemFieldConfig} from '../../../shared/domain/item-field-config';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {FieldConfig} from '../../../shared/domain/field-config';
import {InstructionTypeInputConfigHttpService} from '../../../shared/service/http/instruction-type-input-config-http.service';
import {ArrayUtils} from '../../../shared/utils/array-utils';
import {Language} from '../../../shared/domain/language';
import {ItemHttpService} from '../../../shared/service/http/item-http.service';
import {Item} from '../../../shared/domain/item';
import {ItemFieldConfigManager} from '../../../shared/utils/item-field-config-manager';
import {MandatoryDataService} from '../../../shared/service/mandatory-data.service';
import {FieldConfigHttpService} from '../../../shared/service/http/field-config-http.service';

@Component({
  selector: 'app-item-field-config-list',
  templateUrl: './item-field-config-list.component.html',
  styleUrls: ['./item-field-config-list.component.css']
})
export class ItemFieldConfigListComponent implements OnInit {

  selectedItemFieldConfig: ItemFieldConfig = ItemFieldConfig.default(FieldConfig.default());
  selectedInstructionFieldConfigs: FieldConfig[] = [];
  selectedInstructionLanguage: Language[] = [];
  itemFieldConfigNameInput = new FormControl();
  filteredItemFieldConfigs: ItemFieldConfig[];
  itemFieldConfigs: ItemFieldConfig[] = [];
  instructionsFieldCofigsMap = {};
  instructionLanguages = {};
  instructionsFields = {};
  item: Item;

  constructor(
    private instructionConfigHttpService: InstructionTypeInputConfigHttpService,
    private itemFieldConfigHttpService: ItemFieldConfigHttpService,
    private fieldConfigHttpService: FieldConfigHttpService,
    private mandatoryDataService: MandatoryDataService,
    private progressBarService: ProgressBarService,
    private itemHttpService: ItemHttpService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.progressBarService.show();
    const itemId = this.route.snapshot.paramMap.get(AppProperties.REQUEST_PARAM_ITEM_ID);
    forkJoin(
      this.itemFieldConfigHttpService.getInstructionsByItemId(itemId),
      this.instructionConfigHttpService.getInstructionsLanguages(),
      this.itemHttpService.getByIdWithoutItemFieldConfig(itemId),
      this.fieldConfigHttpService.getInstructionsFields(),
      this.fieldConfigHttpService.getInstructionsFieldConfigsMap()
    ).subscribe(result => {
      this.progressBarService.hide();
      this.itemFieldConfigs = result[0];
      this.instructionLanguages = result[1];
      this.item = result[2];
      this.instructionsFields = result[3];
      this.instructionsFieldCofigsMap = result[4];
      this.initFilter();
    });
  }

  select(itemFieldConfig) {
    this.selectedItemFieldConfig = itemFieldConfig;
    this.selectedInstructionLanguage = this.getSelectedInstructionLanguages();
    this.selectedInstructionFieldConfigs = this.getSelectedInstructionFieldConfigs();
  }

  getSelectedInstructionFieldConfigs(): FieldConfig[] {
    const instructionFields = this.instructionsFields[this.selectedItemFieldConfig.fieldConfig.type];
    if (instructionFields && instructionFields.length > 0) {
      const result: FieldConfig[] = [];
      instructionFields.forEach(fieldName => result.push(this.instructionsFieldCofigsMap[fieldName]));
      return result;
    }
    return [];
  }

  getSelectedInstructionLanguages() {
    const languages = this.instructionLanguages[this.selectedItemFieldConfig.fieldConfig.type];
    return ArrayUtils.isNotEmpty(languages) ? languages : [];
  }

  initFilter() {
    this.itemFieldConfigNameInput.valueChanges.pipe(
      startWith<string>(''),
      map((fieldConfigName: string) => {
        return fieldConfigName ? this._filter(fieldConfigName) : this.itemFieldConfigs.slice();
      })
    ).subscribe(result => this.filteredItemFieldConfigs = result);
  }

  saveForCurrent() {
    this.mandatoryDataService.save(this.getItemFieldConfigWithNewData())
      .subscribe(result => {
        if (ArrayUtils.isNotEmpty(result)) {
          this.replaceChangedItemFieldConfigs(result);
          this.filterItemFieldConfigs();
        }
      });
  }

  replaceChangedItemFieldConfigs(changedItemFieldConfigs: ItemFieldConfig[]) {
    changedItemFieldConfigs.forEach((changedItemFieldConfig: ItemFieldConfig) => {
      const idx = this.getItemFieldConfigIndex(changedItemFieldConfig);
      if (idx > -1) {
        this.itemFieldConfigs[idx] = changedItemFieldConfig;
        if (this.selectedItemFieldConfig.id === changedItemFieldConfig.id) {
          changedItemFieldConfig.selectedMandatoryDataCheckIdx = this.selectedItemFieldConfig.selectedMandatoryDataCheckIdx;
          this.selectedItemFieldConfig = changedItemFieldConfig;
        }
      }
    });
  }

  getItemFieldConfigIndex(searchFieldConfig: ItemFieldConfig) {
    return this.itemFieldConfigs.findIndex(fieldConfig => fieldConfig.fieldConfig.name === searchFieldConfig.fieldConfig.name);
  }

  filterItemFieldConfigs() {
    this.filteredItemFieldConfigs = this._filter(this.itemFieldConfigNameInput.value);
  }

  getItemFieldConfigWithNewData() {
    return this.itemFieldConfigs.filter(i => ItemFieldConfigManager.hasNewMandatoryData(i));
  }

  private _filter(fieldConfigName: string): ItemFieldConfig[] {
    const inLowerCase = fieldConfigName ? fieldConfigName.trim().toLowerCase() : '';
    return this.itemFieldConfigs.filter(itemFieldConfig => itemFieldConfig.fieldConfig.name.toLowerCase().indexOf(inLowerCase) > -1);
  }
}
