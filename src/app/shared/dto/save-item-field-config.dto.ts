import { Item } from "../domain/item";
import { ItemFieldConfig } from "../domain/item-field-config";

export class SaveItemFieldConfigDto {
    constructor(
        public item: Item,
        public itemFieldConfigs: ItemFieldConfig[],
        public saveForAll: boolean,
        public saveForAllStrategy?: string
    ) {

    }
}