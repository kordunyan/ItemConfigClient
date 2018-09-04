import { Item } from "../domain/item";
import { ItemFieldConfig } from "../domain/item-field-config";

export class ItemCrudOperationsDto {
    constructor(
        public item: Item,
        public itemNumbers: string[],
        public itemFieldConfigs: ItemFieldConfig[]
      ) {
    
      }
}