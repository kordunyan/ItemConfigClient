import {ItemFieldConfig} from '../domain/item-field-config';
import {Item} from '../domain/item';

export class ItemWithItemFieldConfigDto {
  constructor(
    public item: Item,
    public itemFieldConfigs: ItemFieldConfig[],
    public saveForAllStrategy: string
  ) {
  }
}
