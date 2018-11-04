import {FieldConfig} from './field-config';
import { MandatoryTranslation } from './mandatory-translation';
import { MandatoryField } from './mandatory-field';

export class ItemFieldConfig {

  public static readonly DEFAULT_ACTIVE = true;
  public static readonly DEFAULT_REQUIRED = true;
  public static readonly DEFAULT_EDITABLE = true;
  public static readonly DEFAULT_DATA_SOURCE_NAME = null;
  public static readonly DEFAULT_PREDEFINED_VALUE = null;
  public static readonly DEFAULT_FILTER_REGEX = null;
  public static readonly DEFAULT_CAN_ADD_LATER = false;
  public static readonly DEFAULT_STORE_LAST_USER_INPUT = false;

  constructor(
    public fieldConfig: FieldConfig,
    public active: boolean,
    public required: boolean,
    public editable: boolean,
    public dataSourceName: string,
    public predefinedValue: string,
    public filterRegex: string,
    public canAddLater: boolean,
    public storeLastUserInput: boolean,
    public id?: number,
    public checked?: boolean,
    public isTextField?: boolean,
    public mandatoryTranslations?: MandatoryTranslation[],
    public mandatoryFields?: MandatoryField[],
    public hasNewMandatoryData?: boolean,
    public hasSelectedMandatoryData?: boolean
  ) {

  }

  public static copy(itemFieldConfig: ItemFieldConfig) {
    return new ItemFieldConfig(
      itemFieldConfig.fieldConfig,
      itemFieldConfig.active,
      itemFieldConfig.required,
      itemFieldConfig.editable,
      itemFieldConfig.dataSourceName,
      itemFieldConfig.predefinedValue,
      itemFieldConfig.filterRegex,
      itemFieldConfig.canAddLater,
      itemFieldConfig.storeLastUserInput,
      itemFieldConfig.id,
      false,
      itemFieldConfig.isTextField
    );
  }

  public static copyOnlyMandatoryData(itemFieldConfig: ItemFieldConfig) {
    const result =  ItemFieldConfig.default(itemFieldConfig.fieldConfig); 
    result.mandatoryFields = itemFieldConfig.mandatoryFields;
    result.mandatoryTranslations = itemFieldConfig.mandatoryTranslations;
    result.id = itemFieldConfig.id;
    return result;
  }

  public static copyValues(src: ItemFieldConfig, dest: ItemFieldConfig) {
    dest.active = src.active;
    dest.required = src.required;
    dest.editable = src.editable;
    dest.dataSourceName = src.dataSourceName;
    dest.predefinedValue = src.predefinedValue;
    dest.filterRegex = src.filterRegex;
    dest.canAddLater = src.canAddLater;
    dest.storeLastUserInput = src.storeLastUserInput;
  }

  public static copyValuesWithoutegex(src: ItemFieldConfig, dest: ItemFieldConfig) {
    dest.active = src.active;
    dest.required = src.required;
    dest.editable = src.editable;
    dest.dataSourceName = src.dataSourceName;
    dest.predefinedValue = src.predefinedValue;
    dest.canAddLater = src.canAddLater;
    dest.storeLastUserInput = src.storeLastUserInput;
  }

  public static default(fieldConfig: FieldConfig, isTextField?: boolean): ItemFieldConfig {
    return new ItemFieldConfig(
      fieldConfig,
      ItemFieldConfig.DEFAULT_ACTIVE,
      ItemFieldConfig.DEFAULT_REQUIRED,
      ItemFieldConfig.DEFAULT_EDITABLE,
      ItemFieldConfig.DEFAULT_DATA_SOURCE_NAME,
      ItemFieldConfig.DEFAULT_PREDEFINED_VALUE,
      ItemFieldConfig.DEFAULT_FILTER_REGEX,
      ItemFieldConfig.DEFAULT_CAN_ADD_LATER,
      ItemFieldConfig.DEFAULT_STORE_LAST_USER_INPUT,
      null,
      false,
      isTextField,
      []
    );
  }

}
