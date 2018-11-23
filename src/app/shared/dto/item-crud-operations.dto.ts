import {Item} from '../domain/item';
import {ItemFieldConfig} from '../domain/item-field-config';
import {ItemFieldsCriteria} from './item-fields-criteria.dto';

export class ItemCrudOperationsDto {
  constructor(
    public item: Item,
    public itemNumbers: string[],
    public itemFieldConfigs: ItemFieldConfig[],
    public forAll: boolean,
    public itemFieldsCriteria?: ItemFieldsCriteria
  ) {

  }
}
