import {Item} from '../domain/item';
import {Field} from '../domain/field';
import {FieldConfig} from '../domain/field-config';
import {AppProperties} from '../domain/app-properties';

export class ItemManager {

  public static getItemField(item: Item, fieldConfigName: string): Field {
    if (!item) {
      return null;
    }
    return item.fields && item.fields.length > 0
      ? item.fields.find((field) => field.fieldConfigName === fieldConfigName)
      : null;
  }

  public static getItemFieldValue(item: Item, fieldConfigName: string): string {
    const field = ItemManager.getItemField(item, fieldConfigName);
    if (field) {
      return field.value;
    }
    return null;
  }

  public static getItemFieldConfig(item: Item, fieldConfigName: string) {
    if (!item) {
      return null;
    }
    return item.itemFieldConfigs && item.itemFieldConfigs.length > 0
      ? item.itemFieldConfigs.find((field) => field.fieldConfigName === fieldConfigName)
      : null;
  }

  public static getItemMultipleFieldsMap(item: Item, fieldConfigs: any): any {
    let result = {};
    item.fields.filter(field => fieldConfigs[field.fieldConfigName].multiple)
      .forEach(field => result[field.fieldConfigName] = field);
    return result;
  }

  public static sortItemsByMultipleFields(items: Item[], fieldConfigs: any) {
    let multipleFields = AppProperties.MULTIPLE_FIELDS_SORT_ORDER;
    let itemMultipleFields = ItemManager.createItemMultipleFields(items, fieldConfigs);
    items.sort((itemA, itemB) => {
      for (let i = 0; i < multipleFields.length; i++) {
        let fieldName = multipleFields[i];
        let itemAFieldValue = itemMultipleFields[itemA.id][fieldName].value;
        let itemBFieldValue = itemMultipleFields[itemB.id][fieldName].value;
        if (itemAFieldValue === itemBFieldValue) {
          continue;
        }
        if (itemAFieldValue === undefined) {
          return -1;
        }
        if (itemBFieldValue === undefined) {
          return 1;
        }
        return (itemAFieldValue > itemBFieldValue) ? 1 : -1;
      }
      return 0;
    });
  }

  private static createItemMultipleFields(items: Item[], fieldConfigMap: any): any {
    let result = {};
    items.forEach(item => result[item.id] = ItemManager.getItemMultipleFieldsMap(item, fieldConfigMap));
    return result;
  }
}
