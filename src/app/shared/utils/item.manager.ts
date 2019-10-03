import {Item} from '../domain/item';
import {Field} from '../domain/field';
import {AppProperties} from '../domain/app-properties';

export class ItemManager {

  public static getItemNumber(item: Item): string {
    return ItemManager.getItemFieldValue(item, AppProperties.FIELD_D2COMM_ITEM_NUMBER)
  }

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
      ? item.itemFieldConfigs.find((field) => field.fieldConfig.name === fieldConfigName)
      : null;
  }

  public static getItemMultipleFieldsMap(item: Item, multipleFields: string[]): any {
    let result = {};
    item.fields.filter(field => multipleFields.findIndex(fieldName => fieldName === field.fieldConfigName) > -1)
      .forEach(field => result[field.fieldConfigName] = field);
    return result;
  }

  public static sortItemsByMultipleFields(items: Item[], multipleFields: string[]) {
    let itemsMultipleFields = ItemManager.createItemsMultipleFields(items, multipleFields);
    items.sort((itemA, itemB) => {
      for (let i = 0; i < multipleFields.length; i++) {
        let fieldName = multipleFields[i];
        let itemAField = itemsMultipleFields[itemA.id][fieldName];
        let itemBField = itemsMultipleFields[itemB.id][fieldName];
        if (!itemAField || !itemAField.value) {
          return -1;
        }
        if (!itemBField || !itemBField.value) {
          return 1;
        }
        if (itemAField.value === itemBField.value) {
          continue;
        }
        return (itemAField.value > itemBField.value) ? 1 : -1;
      }
      return 0;
    });
  }

  private static createItemsMultipleFields(items: Item[], multipleFields: string[]): any {
    let result = {};
    items.forEach(item => result[item.id] = ItemManager.getItemMultipleFieldsMap(item, multipleFields));
    return result;
  }
}
