import { FieldConfig } from "./field-config";

export class MandatoryField {
    constructor(
        public fieldConfig: FieldConfig,
        public selected: boolean = false,
        public id?: number
    ) {

    }
}