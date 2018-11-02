import {ProgressBarService} from './progress-bar.service';
import {MessageService} from './message.service';
import {ArrayUtils} from '../utils/array-utils';
import {ItemFieldConfig} from '../domain/item-field-config';
import {DeleteMandatoryDataDto} from '../dto/delete-mandatory-data.dto';
import {SaveMandatoryDataDto} from '../dto/save-mandatory-data.dto';
import {ItemFieldConfigManager} from '../utils/item-field-config-manager';

export abstract class AbstractMandatoryDataService {

  constructor(
    protected progressBarService: ProgressBarService,
    protected messageService: MessageService,
  ) {
  }

  public delete(itemFieldConfigsWithSelectedData: ItemFieldConfig[], currentItemNumber, deleteOptions?: {}) {
    const itemFieldConfigsWithFilteredSelectedData = this._filterWithSelectedData(itemFieldConfigsWithSelectedData);
    if (ArrayUtils.isEmpty(itemFieldConfigsWithFilteredSelectedData)) {
      return;
    }
    let deleteForAll = deleteOptions && deleteOptions['deleteForAll'] ? true : false;
    let itemNumbers = [currentItemNumber];
    if (deleteForAll && ArrayUtils.isNotEmpty(deleteOptions['itemNumbers'])) {
      itemNumbers = itemNumbers.concat(deleteOptions['itemNumbers']);
    }
    const dto = this._buildDeleteDto(itemFieldConfigsWithFilteredSelectedData, deleteForAll, itemNumbers);
    this._deleteFromServer(dto, itemFieldConfigsWithFilteredSelectedData);
  }

  protected _filterWithSelectedData(itemFieldConfigs: ItemFieldConfig[]): ItemFieldConfig[] {
    return itemFieldConfigs.filter(itemFieldConfig => this._hasSelectedData(itemFieldConfig));
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

  protected _createDtoAndSave(itemFieldConfigsWithNewData: ItemFieldConfig[], saveForAll, itemNumbers?: string[]) {
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

  private _filterWithNewData(itemFieldConfigs: ItemFieldConfig[]): ItemFieldConfig[] {
    return itemFieldConfigs.filter(itemFieldConfig => this._hasNewData(itemFieldConfig));
  }

  protected _replaceItemFieldConfigs(changedItemFieldConfigs: ItemFieldConfig[], itemFieldConfigsWithNewData: ItemFieldConfig[]) {
    changedItemFieldConfigs.forEach(changedField => {
      const itemFieldConfig = itemFieldConfigsWithNewData.find(fieldConfig => fieldConfig.id === changedField.id);
      itemFieldConfig.mandatoryTranslations = changedField.mandatoryTranslations;
      itemFieldConfig.mandatoryFields = changedField.mandatoryFields;
      itemFieldConfig.hasNewMandatoryData = ItemFieldConfigManager.hasNewMandatoryData(itemFieldConfig);
    });
  }

  protected abstract _saveOnServer(dto: SaveMandatoryDataDto, itemFieldConfigsWithNewData: ItemFieldConfig[]);

  protected abstract _hasNewData(itemFieldConfigs: ItemFieldConfig): boolean;

  protected abstract _hasSelectedData(itemFieldConfig: ItemFieldConfig): boolean;

  protected abstract _buildDeleteDto(itemFieldConfigs: ItemFieldConfig[], deleteForAll: boolean, itemNumbers?: string[]): DeleteMandatoryDataDto;

  protected abstract _deleteFromServer(dto: DeleteMandatoryDataDto, itemFieldConfigsWithSelectedData: ItemFieldConfig[]);
}
