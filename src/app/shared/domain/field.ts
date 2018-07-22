import { Item } from "./item";

export class Field {
    constructor(
        public fieldConfigName: string,
        public value: string,
        public fieldSet?,
        public id?: number
    ) {

    }

    public static copyWithoutIdAndFieldSet(field: Field): Field {
        return new Field(field.fieldConfigName, field.value);
    }
}