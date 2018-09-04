import { Item } from "../domain/item";
import { Field } from "../domain/field";

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
}