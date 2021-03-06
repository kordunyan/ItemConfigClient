import {ItemFieldConfig} from '../domain/item-field-config';
import {ArrayUtils} from './array-utils';

export class ItemFieldConfigManager {

  public static equals(fieldA: ItemFieldConfig, fieldB: ItemFieldConfig): boolean {
    if (fieldA == null || fieldB == null) {
      return false;
    }
    if (fieldA.fieldConfig.name !== fieldB.fieldConfig.name) {
      return false;
    }
    if (fieldA.active !== fieldB.active) {
      return false;
    }
    if (fieldA.required !== fieldB.required) {
      return false;
    }
    if (fieldA.editable !== fieldB.editable) {
      return false;
    }
    if (fieldA.dataSourceName !== fieldB.dataSourceName) {
      return false;
    }
    if (fieldA.predefinedValue !== fieldB.predefinedValue) {
      return false;
    }
    if (fieldA.filterRegex !== fieldB.filterRegex) {
      return false;
    }
    if (fieldA.canAddLater !== fieldB.canAddLater) {
      return false;
    }
    if (fieldA.storeLastUserInput !== fieldB.storeLastUserInput) {
      return false;
    }
    return true;
  }

  public static noEquals(fieldA: ItemFieldConfig, fieldB: ItemFieldConfig): boolean {
    return !ItemFieldConfigManager.equals(fieldA, fieldB);
  }

  public static minimizeFieldValues(itemFieldConfig: ItemFieldConfig) {
    if (itemFieldConfig.dataSourceName != null && itemFieldConfig.dataSourceName.length === 0) {
      itemFieldConfig.dataSourceName = null;
    }
    if (itemFieldConfig.predefinedValue != null && itemFieldConfig.predefinedValue.length === 0) {
      itemFieldConfig.predefinedValue = null;
    }
    if (itemFieldConfig.filterRegex != null && itemFieldConfig.filterRegex.length === 0) {
      itemFieldConfig.filterRegex = null;
    }
  }

  public static hasSelectedMandatoryData(itemFieldConfig: ItemFieldConfig): boolean {
    if (ArrayUtils.isNotEmpty(itemFieldConfig.mandatoryFields)) {
      const selectedMandatoryField = itemFieldConfig.mandatoryFields.find(field => field.selected);
      if (selectedMandatoryField) {
        return true;
      }
    }
    if (ArrayUtils.isNotEmpty(itemFieldConfig.mandatoryTranslations)) {
      const selectedTranslation = itemFieldConfig.mandatoryTranslations.find(translation => translation.selected);
      if (selectedTranslation) {
        return true;
      }
    }
    return false;
  }

  public static hasNewMandatoryData(itemFieldConfig: ItemFieldConfig): boolean {
    if (ArrayUtils.isNotEmpty(itemFieldConfig.mandatoryFields)) {
      const newFields = itemFieldConfig.mandatoryFields.find(field => !field.id);
      if (newFields) {
        return true;
      }
    }
    if (ArrayUtils.isNotEmpty(itemFieldConfig.mandatoryTranslations)) {
      const newTranslations = itemFieldConfig.mandatoryTranslations.find(translation => !translation.id);
      if (newTranslations) {
        return true;
      }
    }
    return false;
  }

  public static copyMandatoryData(from: ItemFieldConfig, to: ItemFieldConfig) {
    to.mandatoryFields = from.mandatoryFields;
    to.mandatoryTranslations = from.mandatoryTranslations;
    to.hasSelectedMandatoryData = ItemFieldConfigManager.hasSelectedMandatoryData(to);
    to.hasNewMandatoryData = ItemFieldConfigManager.hasNewMandatoryData(to);
  }
}
