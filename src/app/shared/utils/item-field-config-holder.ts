import {Item} from '../domain/item';
import {FieldConfig} from '../domain/field-config';
import {ItemFieldConfig} from '../domain/item-field-config';
import {ItemManager} from './item.manager';
import {AbstractItemFieldConfigHolder} from './abstract-item-field-holder';
import {ItemFieldConfigManager} from './item-field-config-manager';

export class ItemFieldConfigHolder extends AbstractItemFieldConfigHolder {
  itemFieldConfigsCopy: ItemFieldConfig[] = [];
  itemFieldConfigsCopyMap = {};

  constructor(
    public item: Item,
    public fieldConfigs: FieldConfig[]
  ) {
    super(item, fieldConfigs);
    this.initItemFieldConfig();
  }

  initItemFieldConfig() {
    ItemFieldConfigHolder.copyItemFieldConfigs(this.item.itemFieldConfigs, this.itemFieldConfigsCopy);
    this.itemFieldConfigsCopyMap = ItemFieldConfigHolder.createItemFieldConfigCopyMap(this.item.itemFieldConfigs);
    this.sortItemFieldConfigs(this.item.itemFieldConfigs);
    this.createNoActiveFieldConfigs();
  }

  setItem(item: Item) {
    this.item = item;
    this.initItemFieldConfig();
  }

  public static createItemFieldConfigCopyMap(itemFieldConfigs: ItemFieldConfig[]) {
    const fieldConfigsCopy = itemFieldConfigs.map(itemFieldConfig => ItemFieldConfig.copy(itemFieldConfig));
    return ItemFieldConfigHolder.createItemFieldConfigMap(fieldConfigsCopy);
  }

  public static createItemFieldConfigMap(itemFieldConfigs: ItemFieldConfig[]) {
    const itemFieldConfigsCopyMap = {};
    itemFieldConfigs.forEach((itemFieldConfig: ItemFieldConfig) => {
      itemFieldConfigsCopyMap[itemFieldConfig.fieldConfigName] = itemFieldConfig;
    });
    return itemFieldConfigsCopyMap;
  }

  createNoActiveFieldConfigs() {
    this.noActiveFieldConfigs = [];
    this.fieldConfigs.forEach(fieldConfig => {
      if (ItemManager.getItemFieldConfig(this.item, fieldConfig.name) == null) {
        this.noActiveFieldConfigs.push(fieldConfig);
      }
    });
    this.sortFieldConfigs(this.noActiveFieldConfigs);
  }

  createNewItemFieldConfigs(fieldConfigNames: string[]) {
    if (!this.item.itemFieldConfigs) {
      this.item.itemFieldConfigs = [];
    }
    fieldConfigNames.forEach(fieldConfigName => {
      this.item.itemFieldConfigs.push(ItemFieldConfig.default(fieldConfigName));
      this.removeNoActiveField(fieldConfigName);
    });
    this.sortItemFieldConfigs(this.item.itemFieldConfigs);
  }

  sortItemFieldConfigs(itemFieldConfigs: ItemFieldConfig[]) {
    this.sortFields(itemFieldConfigs, (itemFieldConfig: ItemFieldConfig) => itemFieldConfig.fieldConfigName.toLowerCase());
  }

  resetItemFieldConfigs() {
    ItemFieldConfigHolder.copyItemFieldConfigs(this.itemFieldConfigsCopy, this.item.itemFieldConfigs);
    this.createNoActiveFieldConfigs();
    this.sortItemFieldConfigs(this.item.itemFieldConfigs);
  }

  public static copyItemFieldConfigs(src: ItemFieldConfig[], dest: ItemFieldConfig[]) {
    dest.length = 0;
    src.forEach(itemFieldConfig => dest.push(ItemFieldConfig.copy(itemFieldConfig)));
  }

  getSelectedItemFieldConfigs(): ItemFieldConfig[] {
    return this.item.itemFieldConfigs.filter(itemFieldConfig => itemFieldConfig.checked === true);
  }

  getSelectedNoNewItemFieldConfigs(): ItemFieldConfig[] {
    return this.getSelectedItemFieldConfigs().filter(itemFieeldConfig => itemFieeldConfig.id !== undefined);
  }

  getChangedItemFields(): ItemFieldConfig[] {
    console.log(this.itemFieldConfigsCopyMap);
    let result: ItemFieldConfig[] = [];
    this.item.itemFieldConfigs.forEach((itemFieldConfig: ItemFieldConfig) => {
      let copiedField = this.itemFieldConfigsCopyMap[itemFieldConfig.fieldConfigName];
      ItemFieldConfigManager.minimizeFieldValues(itemFieldConfig);
      if (copiedField == null) {
        result.push(itemFieldConfig);
      } else if (ItemFieldConfigManager.noEquals(itemFieldConfig, copiedField)) {
        result.push(itemFieldConfig);
      }
    });
    return result;
  }
}
