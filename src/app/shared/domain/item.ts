import { Field } from "./field";
import { ItemFieldConfig } from "./item-field-config";

export class Item {
    constructor(
        public ipps: boolean,
        public sb: boolean,
        public fields: Field[],
        public fieldSet?,
        public id?: number,
        public itemFieldConfigs?: ItemFieldConfig[]
    ) {

    }

    public static copyWithoutFields(item: Item): Item {
        return new Item(item.ipps, item.sb, [], item.fieldSet, item.id);
    }   

    public static copyWithoutFieldConfigs(item : Item): Item {
        return new Item(item.ipps, item.sb, item.fields, item.fieldSet, item.id);
    }
}