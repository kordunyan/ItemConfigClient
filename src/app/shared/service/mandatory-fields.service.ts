import {Injectable} from '@angular/core';
import {ProgressBarService} from './progress-bar.service';
import {MessageService} from './message.service';
import {MandatoryFieldsHttpService} from './http/mandatory-fields-http.service';
import {ItemFieldConfig} from '../domain/item-field-config';
import {ArrayUtils} from '../utils/array-utils';
import {SaveMandatoryDataDto} from '../dto/save-mandatory-data.dto';

@Injectable({
  providedIn: 'root',
})
export class MandatoryFieldsService {

  constructor(
    private progressBarService: ProgressBarService,
    private messageService: MessageService,
    private mandatoryFieldsHttpService: MandatoryFieldsHttpService
  ) {
  }

  public save(itemFieldConfigsWithNewData: ItemFieldConfig[]) {
    this._createDtoAndSave(itemFieldConfigsWithNewData, false);
  }

  public saveForItemNumbers(itemFieldConfigsWithNewData: ItemFieldConfig[], currentItemNumber, itemNumbers?: string[]) {
    let selectedItemNumbers = [currentItemNumber];
    if (ArrayUtils.isNotEmpty(itemNumbers)) {
      selectedItemNumbers = selectedItemNumbers.concat(itemNumbers);
    }
    this._createDtoAndSave(itemFieldConfigsWithNewData, true, selectedItemNumbers);
  }

  private _createDtoAndSave(itemFieldConfigsWithNewData: ItemFieldConfig[], saveForAll, itemNumbers?: string[]) {
    const itemFieldConfigsWithNewFields = this._filterWithNewData(itemFieldConfigsWithNewData);
    if (ArrayUtils.isEmpty(itemFieldConfigsWithNewFields)) {
      return;
    }
    const dto = this.buildSaveMandatoryDataDto(itemFieldConfigsWithNewFields, saveForAll, itemNumbers);
    this._saveOnServer(dto, itemFieldConfigsWithNewFields);
  }

  protected buildSaveMandatoryDataDto(itemFieldConfigs: ItemFieldConfig[], saveForAll: boolean, itemNumbers?: string[]): SaveMandatoryDataDto {
    return new SaveMandatoryDataDto(itemFieldConfigs, saveForAll, itemNumbers);
  }

  private _saveOnServer(dto: SaveMandatoryDataDto, itemFieldConfigsWithNewData: ItemFieldConfig[]) {
    this.progressBarService.show();
    this.mandatoryFieldsHttpService.save(dto).subscribe(
      result => {
        this._replaceItemFieldConfigs(result, itemFieldConfigsWithNewData);
        this.messageService.success('Mandatory fields were saved');
        this.progressBarService.hide();
      }, error => this.progressBarService.hide());
  }

  protected _replaceItemFieldConfigs(changedItemFieldConfigs: ItemFieldConfig[], itemFieldConfigsWithNewData: ItemFieldConfig[]) {
    changedItemFieldConfigs.forEach(changedField => {
      const itemFieldConfig = itemFieldConfigsWithNewData.find(fieldConfig => fieldConfig.id === changedField.id);
      itemFieldConfig.mandatoryTranslations = changedField.mandatoryTranslations;
      itemFieldConfig.mandatoryFields = changedField.mandatoryFields;
    });
  }

  private _filterWithNewData(itemFieldConfigs: ItemFieldConfig[]): ItemFieldConfig[] {
    return itemFieldConfigs.filter(itemFieldConfig => this.hasNewData(itemFieldConfig));
  }

  protected hasNewData(itemFieldConfigs: ItemFieldConfig): boolean {
    return itemFieldConfigs.mandatoryFields.findIndex(field => !field.id) >= 0;
  }


}
