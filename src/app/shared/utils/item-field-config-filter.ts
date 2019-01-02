import {ItemFieldConfig} from '../domain/item-field-config';
import {Subject} from 'rxjs';

export class ItemFieldConfigFilter {
  public static readonly TYPE_ALL = 'ALL';
  public static readonly TYPE_NEW = 'NEW';
  public static readonly TYPE_ACTIVE = 'ACTIVE';
  public static readonly TYPE_CHANGED = 'CHANGED';

  itemFieldConfigsChange;
  filteredItemFieldConfigs: ItemFieldConfig[] = [];

  static filterAll() {
    return () => true;
  }

  static filterActive() {
    return (itemFieldConfig: ItemFieldConfig) => itemFieldConfig.active;
  }

  static filterNew() {
    return (itemFieldConfig: ItemFieldConfig) => !itemFieldConfig.id;
  }

  static filterChanged() {
    return (itemFieldConfig: ItemFieldConfig) => itemFieldConfig.changed;
  }

  public constructor(
    public itemFieldConfigs: ItemFieldConfig[],
    public filterType = ItemFieldConfigFilter.TYPE_ALL
  ) {
    this.doFilter();
    this.itemFieldConfigsChange = new Subject();
    this.itemFieldConfigsChange.subscribe((changedItemFieldConfigs) => {
      this.itemFieldConfigs = changedItemFieldConfigs;
      this.doFilter();
    });
  }

  doFilter() {
    const filtered = this.filter(this.getFilterFunction());
    this.filteredItemFieldConfigs = filtered;
  }

  changeFilterType(filterType) {
    this.filterType = filterType;
    this.doFilter();
  }

  getFilterFunction() {
    switch (this.filterType) {
      case ItemFieldConfigFilter.TYPE_ALL:
        return ItemFieldConfigFilter.filterAll();
      case ItemFieldConfigFilter.TYPE_ACTIVE:
        return ItemFieldConfigFilter.filterActive();
      case ItemFieldConfigFilter.TYPE_NEW:
        return ItemFieldConfigFilter.filterNew();
      case ItemFieldConfigFilter.TYPE_CHANGED:
        return ItemFieldConfigFilter.filterChanged();
      default:
        return ItemFieldConfigFilter.filterAll();
    }
  }

  filter(filterFunction) {
    return this.itemFieldConfigs.filter(itemFieldConfig => filterFunction(itemFieldConfig));
  }
}
