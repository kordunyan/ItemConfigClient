import {ProgressBarService} from './progress-bar.service';
import {MessageService} from './message.service';
import {ArrayUtils} from '../utils/array-utils';
import {ItemFieldConfig} from '../domain/item-field-config';
import {DeleteMandatoryDataDto} from '../dto/delete-mandatory-data.dto';
import {SaveMandatoryDataDto} from '../dto/save-mandatory-data.dto';
import {ItemFieldConfigManager} from '../utils/item-field-config-manager';
import { MandatoryDataHttpService } from './http/mandatory-data-http,service';
import { Injectable } from '@angular/core';
import {ItemFieldsCriteria} from '../dto/item-fields-criteria.dto';

@Injectable({
  providedIn: 'root',
})
export class MandatoryDataService {

  constructor(
    protected mandatoryDataHttpService: MandatoryDataHttpService,
    protected progressBarService: ProgressBarService,
    protected messageService: MessageService,
  ) {
  }

  public delete(itemFieldConfigsWithSelectedData: ItemFieldConfig[], currentItemNumber, deleteOptions?: {}) {
    if (ArrayUtils.isEmpty(itemFieldConfigsWithSelectedData)) {
      return;
    }
    let deleteForAll = deleteOptions && deleteOptions['deleteForAll'] ? true : false;
    let itemNumbers = [currentItemNumber];
    if (deleteForAll && ArrayUtils.isNotEmpty(deleteOptions['itemNumbers'])) {
      itemNumbers = itemNumbers.concat(deleteOptions['itemNumbers']);
    }
    const dto = this.buildDeleteDto(itemFieldConfigsWithSelectedData, deleteForAll, itemNumbers);
    this.deleteFromServer(dto, itemFieldConfigsWithSelectedData);
  }

  public save(itemFieldConfigsWithNewData: ItemFieldConfig[]) {
    this.createDtoAndSave(itemFieldConfigsWithNewData, false);
  }

  public saveForItemNumbers(itemFieldConfigsWithNewData: ItemFieldConfig[], currentItemNumber, itemsCriteria: any) {
    console.log(itemsCriteria);
    let selectedItemNumbers = [currentItemNumber];
    if (ArrayUtils.isNotEmpty(itemsCriteria.itemNumbers)) {
      selectedItemNumbers = selectedItemNumbers.concat(itemsCriteria.itemNumbers);
    }
    this.createDtoAndSave(itemFieldConfigsWithNewData, true, selectedItemNumbers, itemsCriteria.itemFieldsCriteria);
  }

  protected createDtoAndSave(itemFieldConfigsWithNewData: ItemFieldConfig[], saveForAll, itemNumbers?: string[],
      itemsCriteria?: ItemFieldsCriteria) {
    if (ArrayUtils.isEmpty(itemFieldConfigsWithNewData)) {
      return;
    }
    const dto = this.buildSaveMandatoryDataDto(itemFieldConfigsWithNewData, saveForAll, itemNumbers, itemsCriteria);
    this.saveOnServer(dto, itemFieldConfigsWithNewData);
  }

  protected buildSaveMandatoryDataDto(itemFieldConfigs: ItemFieldConfig[], saveForAll: boolean, itemNumbers?: string[],
      itemsCriteria?: ItemFieldsCriteria): SaveMandatoryDataDto {
    return new SaveMandatoryDataDto(itemFieldConfigs, saveForAll, itemNumbers, itemsCriteria);
  }

  protected replaceItemFieldConfigs(changedItemFieldConfigs: ItemFieldConfig[], itemFieldConfigsWithNewData: ItemFieldConfig[]) {
    changedItemFieldConfigs.forEach(changedField => {
      const itemFieldConfig = itemFieldConfigsWithNewData.find(fieldConfig => fieldConfig.id === changedField.id);
      itemFieldConfig.mandatoryTranslations = changedField.mandatoryTranslations;
      itemFieldConfig.mandatoryFields = changedField.mandatoryFields;
      itemFieldConfig.hasNewMandatoryData = ItemFieldConfigManager.hasNewMandatoryData(itemFieldConfig);
      itemFieldConfig.hasSelectedMandatoryData = ItemFieldConfigManager.hasSelectedMandatoryData(itemFieldConfig);
    });
  }

  protected saveOnServer(dto: SaveMandatoryDataDto, itemFieldConfigsWithNewData: ItemFieldConfig[]) {
    this.progressBarService.show();
    this.mandatoryDataHttpService.save(dto).subscribe(result => {
      this.replaceItemFieldConfigs(result, itemFieldConfigsWithNewData);
      this.messageService.success('Mandatory data were saved');
      this.progressBarService.hide();
    }, error => this.progressBarService.hide());
  }

  protected buildDeleteDto(itemFieldConfigs: ItemFieldConfig[], deleteForAll: boolean, itemNumbers?: string[]): DeleteMandatoryDataDto {
    const result = new DeleteMandatoryDataDto(deleteForAll, itemNumbers);
    result.translationsToDeleteByFieldName = this.buildTranslationsToDeleteByFieldName(itemFieldConfigs);
    result.fieldsToDeleteByFieldName = this.buildFieldsToDeleteByFieldName(itemFieldConfigs);
    return result;
  }

  protected buildTranslationsToDeleteByFieldName(itemFieldConfigs: ItemFieldConfig[]) {
    const result = {};
    itemFieldConfigs.forEach(itemFieldConfig => {
      result[itemFieldConfig.fieldConfig.name] =
        itemFieldConfig.mandatoryTranslations.filter(translation => translation.selected);
    });
    return result;
  }

  protected buildFieldsToDeleteByFieldName(itemFieldConfigs: ItemFieldConfig[]) {
    const result = {};
    itemFieldConfigs.forEach(itemFieldConfig => {
      result[itemFieldConfig.fieldConfig.name] = itemFieldConfig.mandatoryFields.filter(field => field.selected);
    });
    return result;
  }

  protected deleteFromServer(dto: DeleteMandatoryDataDto, itemFieldConfigsWithSelectedData: ItemFieldConfig[]) {
    this.progressBarService.show();
    this.mandatoryDataHttpService.delete(dto).subscribe(
      result => {
        itemFieldConfigsWithSelectedData.forEach(itemFieldConfig => {
          itemFieldConfig.mandatoryFields = itemFieldConfig.mandatoryFields.filter(field => !field.selected);
          itemFieldConfig.mandatoryTranslations = itemFieldConfig.mandatoryTranslations.filter(translation => !translation.selected);
          itemFieldConfig.hasSelectedMandatoryData = ItemFieldConfigManager.hasSelectedMandatoryData(itemFieldConfig);
          itemFieldConfig.hasNewMandatoryData = ItemFieldConfigManager.hasNewMandatoryData(itemFieldConfig);
        });
        this.messageService.success('Mandatory data were deleted');
        this.progressBarService.hide();
      }, error => this.progressBarService.hide()
    );
  }
}
