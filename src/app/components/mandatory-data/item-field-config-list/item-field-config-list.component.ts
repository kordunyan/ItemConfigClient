import {Component, OnInit} from '@angular/core';
import {ItemFieldConfigHttpService} from 'src/app/shared/service/http/item-field-config-http.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {forkJoin} from 'rxjs';
import {first, switchMap} from 'rxjs/operators';
import {AppProperties} from 'src/app/shared/domain/app-properties';
import {ItemFieldConfig} from 'src/app/shared/domain/item-field-config';
import {FieldConfigHttpService} from 'src/app/shared/service/http/field-config-http.service';
import {LanguageHttpService} from 'src/app/shared/service/http/language-http.service';
import {Language} from 'src/app/shared/domain/language';
import {ProgressBarService} from 'src/app/shared/service/progress-bar.service';
import {ItemHttpService} from '../../../shared/service/http/item-http.service';
import {FieldConfig} from 'src/app/shared/domain/field-config';
import { InstructionTypeInputConfigHttpService } from 'src/app/shared/service/http/instruction-type-input-config-http.service';
import { Item } from 'src/app/shared/domain/item';
import { SaveMandatoryDataDto } from 'src/app/shared/dto/save-mandatory-data.dto';
import { MandatoryTranslationsHttpService } from 'src/app/shared/service/http/mandatory-translations-http.service';
import { ItemManager } from 'src/app/shared/utils/item.manager';
import { MessageService } from 'src/app/shared/service/message.service';
import { DeleteMandatoryDataDto } from 'src/app/shared/dto/delete-mandatory-data.dto';

@Component({
  selector: 'app-item-field-config-list',
  templateUrl: './item-field-config-list.component.html',
  styleUrls: ['./item-field-config-list.component.css']
})
export class ItemFieldConfigListComponent implements OnInit {

  itemFieldConfigs: ItemFieldConfig[] = [];
  instructionsFields = {};
  instructionLanguages = {};
  instructionsFieldCofigsMap = {};
  selectedItemFieldConfig: ItemFieldConfig = ItemFieldConfig.default(FieldConfig.default());
  selectedInstructionFieldConfigs: FieldConfig[] = [];
  selectedInstructionLanguages: Language[] = [];
  item: Item;

  constructor(
    private instructionConfigHttpService: InstructionTypeInputConfigHttpService,
    private mandatoryTranslationsHttpService: MandatoryTranslationsHttpService,
    private itemFieldConfigHttpService: ItemFieldConfigHttpService,
    private fieldConfigHttpService: FieldConfigHttpService,
    private progressBarService: ProgressBarService,
    private messageService: MessageService,
    private itemHttpService: ItemHttpService,
    private route: ActivatedRoute,
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
      this.progressBarService.hide();
    }, (error) => this.progressBarService.hide());
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
    this.createDtoAndSaveTranslations(false);
  }

  saveForItemNumberTranslations(itemNumbers?: string[]) {
    let selectedItemNumbers = [this.getItemNumber()];
    if (itemNumbers && itemNumbers.length > 0) {
      selectedItemNumbers = selectedItemNumbers.concat(itemNumbers);
    }
    this.createDtoAndSaveTranslations(true, selectedItemNumbers);
  }

  createDtoAndSaveTranslations(saveForAll, itemNumbers?: string[]) {
    const iteFieldConfigsWithNewData = this.getItemFieldConfigsWithNewData(); 
    if (!iteFieldConfigsWithNewData || iteFieldConfigsWithNewData.length === 0) {
      return;
    }  
    const dto = this.buildSaveMandatoryDataDto(iteFieldConfigsWithNewData, saveForAll, itemNumbers);
    this.saveMandatoryTranslations(dto);
  }

  saveMandatoryTranslations(dto: SaveMandatoryDataDto) {
    this.progressBarService.show();
    this.mandatoryTranslationsHttpService.save(dto).subscribe(result => {
      this.replaceItemFieldConfigs(result);
      this.messageService.success('Mandatory translations were saved');
      this.progressBarService.hide();
    }, error => this.progressBarService.hide());
  }

  replaceItemFieldConfigs(changedItemFieldConfigs: ItemFieldConfig[]) {
    changedItemFieldConfigs.forEach(changedField => {
      const idx = this.itemFieldConfigs.findIndex(fieldConfig => fieldConfig.id === changedField.id );
      this.itemFieldConfigs[idx] = changedField;
      if (this.selectedItemFieldConfig.id === changedField.id) {
        this.selectedItemFieldConfig = changedField;
      }
    });  
  }

  buildSaveMandatoryDataDto(itemFieldConfigs: ItemFieldConfig[], 
    saveForAll: boolean, itemNumbers?: string[]): SaveMandatoryDataDto {
      return new SaveMandatoryDataDto(itemFieldConfigs, saveForAll, itemNumbers);
  }

  deleteTranslation(deleteOptions?: {}) {
    const itemFieldConfigsWithSelectedData = this.getItemFieldConfigsWithSelectedData(); 
    if (!itemFieldConfigsWithSelectedData || itemFieldConfigsWithSelectedData.length === 0) {
      return;
    }
    this.progressBarService.show();
    const dto = this.buildDeleteTranslationsDto(itemFieldConfigsWithSelectedData, false);
    this.mandatoryTranslationsHttpService.delete(dto).subscribe((result) => {
      console.log(result);
      itemFieldConfigsWithSelectedData.forEach(itemFieldConfig => {
        itemFieldConfig.mandatoryTranslations = itemFieldConfig.mandatoryTranslations.filter(translation => !translation.selected);   
      });
      this.messageService.success('Mandatory translations were deleted');
      this.progressBarService.hide();
    }, (error) => this.progressBarService.hide());
  }

  buildDeleteTranslationsDto(itemFieldConfigs: ItemFieldConfig[], deleteForAll: boolean, itemNumbers?: string[]): DeleteMandatoryDataDto {
    let translationsToDeleteByFieldName = {};
    itemFieldConfigs.forEach(itemFieldConfig => {
      translationsToDeleteByFieldName[itemFieldConfig.fieldConfig.name] = 
          itemFieldConfig.mandatoryTranslations.filter(translation => translation.selected);   
    });
    return new DeleteMandatoryDataDto(translationsToDeleteByFieldName, deleteForAll, itemNumbers);
  }
}
