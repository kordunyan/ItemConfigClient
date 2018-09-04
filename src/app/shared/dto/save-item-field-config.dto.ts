import {Item} from '../domain/item';
import {ItemFieldConfig} from '../domain/item-field-config';
import { ItemCrudOperationsDto } from './item-crud-operations.dto';

export class SaveItemFieldConfigDto extends ItemCrudOperationsDto{
  constructor(
    item: Item,
    itemNumbers: string[],
    itemFieldConfigs: ItemFieldConfig[],
    public saveForAll: boolean,
    public saveForAllStrategy?: string
  ) {
    super(item, itemNumbers, itemFieldConfigs);
  }
}
