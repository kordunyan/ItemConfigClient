import {Injectable} from '@angular/core';
import {MandatoryTranslationsHttpService} from './http/mandatory-translations-http.service';
import {ItemFieldConfig} from '../domain/item-field-config';
import {SaveMandatoryDataDto} from '../dto/save-mandatory-data.dto';
import {ProgressBarService} from './progress-bar.service';
import {MessageService} from './message.service';
import {ArrayUtils} from '../utils/array-utils';
import {DeleteMandatoryDataDto} from '../dto/delete-mandatory-data.dto';

@Injectable({
  providedIn: 'root',
})
export class MandatoryTranslationsService {

  constructor(
    private mandatoryTranslationsHttpService: MandatoryTranslationsHttpService,
    private progressBarService: ProgressBarService,
    private messageService: MessageService
  ) {
  }

  static buildSaveMandatoryDataDto(itemFieldConfigs: ItemFieldConfig[], saveForAll: boolean, itemNumbers?: string[]): SaveMandatoryDataDto {
    return new SaveMandatoryDataDto(itemFieldConfigs, saveForAll, itemNumbers);
  }

  save(itemFieldConfigsWithNewData: ItemFieldConfig[]) {
    this._createDtoAndSave(itemFieldConfigsWithNewData, false);
  }

  saveForItemNumbers(itemFieldConfigsWithNewData: ItemFieldConfig[], currentItemNumber, itemNumbers?: string[]) {
    let selectedItemNumbers = [currentItemNumber];
    if (ArrayUtils.isNotEmpty(itemNumbers)) {
      selectedItemNumbers = selectedItemNumbers.concat(itemNumbers);
    }
    this._createDtoAndSave(itemFieldConfigsWithNewData, true, selectedItemNumbers);
  }

  private _createDtoAndSave(itemFieldConfigsWithNewData: ItemFieldConfig[], saveForAll, itemNumbers?: string[]) {
    const itemFieldConfigsWithNewTranslations = this._filterWithNewTranslations(itemFieldConfigsWithNewData);
    if (ArrayUtils.isEmpty(itemFieldConfigsWithNewTranslations)) {
      return;
    }
    const dto = MandatoryTranslationsService.buildSaveMandatoryDataDto(itemFieldConfigsWithNewTranslations, saveForAll, itemNumbers);
    this.saveMandatoryTranslations(dto, itemFieldConfigsWithNewTranslations);
  }

  private _filterWithNewTranslations(itemFieldConfigs: ItemFieldConfig[]): ItemFieldConfig[] {
    return itemFieldConfigs.filter(itemFieldConfig => {
      return itemFieldConfig.mandatoryTranslations.findIndex(translation => !translation.id) >= 0;
    });
  }

  private _filterWithSelectedTranslations(itemFieldConfigs: ItemFieldConfig[]): ItemFieldConfig[] {
    return itemFieldConfigs.filter(itemFieldConfig => {
      return itemFieldConfig.mandatoryTranslations.findIndex(translation => translation.selected) >= 0;
    });
  }

  saveMandatoryTranslations(dto: SaveMandatoryDataDto, itemFieldConfigsWithNewData: ItemFieldConfig[]) {
    this.progressBarService.show();
    this.mandatoryTranslationsHttpService.save(dto).subscribe(result => {
      this.replaceItemFieldConfigs(result, itemFieldConfigsWithNewData);
      this.messageService.success('Mandatory translations were saved');
      this.progressBarService.hide();
    }, error => this.progressBarService.hide());
  }

  replaceItemFieldConfigs(changedItemFieldConfigs: ItemFieldConfig[], itemFieldConfigsWithNewData: ItemFieldConfig[]) {
    changedItemFieldConfigs.forEach(changedField => {
      const itemFieldConfig = itemFieldConfigsWithNewData.find(fieldConfig => fieldConfig.id === changedField.id);
      itemFieldConfig.mandatoryTranslations = changedField.mandatoryTranslations;
    });
  }

  deleteTranslations(itemFieldConfigsWithSelectedData: ItemFieldConfig[], currentItemNumber, deleteOptions?: {}) {
    let itemFieldConfigsWithSelectedTranslations = this._filterWithSelectedTranslations(itemFieldConfigsWithSelectedData);
    if (ArrayUtils.isEmpty(itemFieldConfigsWithSelectedTranslations)) {
      return;
    }
    let deleteForAll = deleteOptions && deleteOptions['deleteForAll'] ? true : false;
    let itemNumbers = [];
    if (deleteForAll) {
      itemNumbers.push(currentItemNumber);
      if (ArrayUtils.isNotEmpty(deleteOptions['itemNumbers'])) {
        itemNumbers = itemNumbers.concat(deleteOptions['itemNumbers']);
      }
    }
    const dto = this.buildDeleteTranslationsDto(itemFieldConfigsWithSelectedTranslations, deleteForAll, itemNumbers);
    this._deleteMandatoryTranslations(dto, itemFieldConfigsWithSelectedTranslations);
  }

  private _deleteMandatoryTranslations(dto: DeleteMandatoryDataDto, itemFieldConfigsWithSelectedData: ItemFieldConfig[]) {
    this.progressBarService.show();
    this.mandatoryTranslationsHttpService.delete(dto).subscribe((result) => {
      itemFieldConfigsWithSelectedData.forEach(itemFieldConfig => {
        itemFieldConfig.mandatoryTranslations = itemFieldConfig.mandatoryTranslations.filter(translation => !translation.selected);
      });
      this.messageService.success('Mandatory translations were deleted');
      this.progressBarService.hide();
    }, (error) => this.progressBarService.hide());
  }

  buildDeleteTranslationsDto(itemFieldConfigs: ItemFieldConfig[], deleteForAll: boolean, itemNumbers?: string[]): DeleteMandatoryDataDto {
    const translationsToDeleteByFieldName = {};
    itemFieldConfigs.forEach(itemFieldConfig => {
      translationsToDeleteByFieldName[itemFieldConfig.fieldConfig.name] =
        itemFieldConfig.mandatoryTranslations.filter(translation => translation.selected);
    });
    const result = new DeleteMandatoryDataDto(deleteForAll, itemNumbers);
    result.translationsToDeleteByFieldName = translationsToDeleteByFieldName;
    return result;
  }

}
