import { Field } from "../domain/field";

export class ItemFieldCrudOperationsDto {
    constructor(
        public itemNumbers: string[],
        public fields: Field[]
    ) {

    }
}