import {Item} from '../domain/item';
import {FieldConfig} from '../domain/field-config';
import {ItemFieldConfig} from '../domain/item-field-config';
import {ItemManager} from './item.manager';
import {AbstractItemFieldConfigHolder} from './abstract-item-field-holder';
import {ItemFieldConfigManager} from './item-field-config-manager';
import {FieldType} from '../domain/field-type';
import {ItemFieldConfigFilter} from './item-field-config-filter';

export class ItemFieldConfigHolder extends AbstractItemFieldConfigHolder {
  itemFieldConfigsCopy: ItemFieldConfig[] = [];
  itemFieldConfigsCopyMap = {};
  itemFieldConfigFilter: ItemFieldConfigFilter;

  constructor(
    public item: Item,
    public fieldConfigs: FieldConfig[],
    public instructionsFields: {}
  ) {
    super(item, fieldConfigs);
    this.initItemFieldConfig();
    this.itemFieldConfigFilter = new ItemFieldConfigFilter(this.item.itemFieldConfigs, ItemFieldConfigFilter.TYPE_ALL);
  }

  changeFilterItemFieldConfigs() {
    this.itemFieldConfigFilter.itemFieldConfigsChange.next(this.item.itemFieldConfigs);
  }

  initItemFieldConfig() {
    this.setIsTextField();
    ItemFieldConfigHolder.copyItemFieldConfigs(this.item.itemFieldConfigs, this.itemFieldConfigsCopy);
    this.itemFieldConfigsCopyMap = ItemFieldConfigHolder.createItemFieldConfigCopyMap(this.item.itemFieldConfigs);
    this.sortItemFieldConfigs(this.item.itemFieldConfigs);
    this.createNoActiveFieldConfigs();
  }

  setIsTextField() {
    this.item.itemFieldConfigs.forEach((itemFieldConfig: ItemFieldConfig) => {
      itemFieldConfig.isTextField = this.isTextField(itemFieldConfig.fieldConfigName);
    });
  }

  isTextField(fieldConfigName): boolean {
    return this.fieldConfigMap[fieldConfigName].type === FieldType.TEXT_FIELD;
  }

  setItem(item: Item) {
    this.item = item;
    this.initItemFieldConfig();
    this.changeFilterItemFieldConfigs();
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
    let newItemFields = fieldConfigNames.map(fieldConfigName => {
      this.removeNoActiveField(fieldConfigName);
      return ItemFieldConfig.default(fieldConfigName, this.isTextField(fieldConfigName));
    });
    this.item.itemFieldConfigs = this.item.itemFieldConfigs.concat(newItemFields);
    this.sortItemFieldConfigs(this.item.itemFieldConfigs);
    this.changeFilterItemFieldConfigs();
  }

  sortItemFieldConfigs(itemFieldConfigs: ItemFieldConfig[]) {
    this.sortFields(itemFieldConfigs, (itemFieldConfig: ItemFieldConfig) => itemFieldConfig.fieldConfigName.toLowerCase());
  }

  resetItemFieldConfigs() {
    ItemFieldConfigHolder.copyItemFieldConfigs(this.itemFieldConfigsCopy, this.item.itemFieldConfigs);
    this.item.itemFieldConfigs = this.item.itemFieldConfigs.slice();
    this.createNoActiveFieldConfigs();
    this.sortItemFieldConfigs(this.item.itemFieldConfigs);
    this.changeFilterItemFieldConfigs();
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
