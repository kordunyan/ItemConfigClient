import { ItemFieldConfig } from "../domain/item-field-config";

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
}