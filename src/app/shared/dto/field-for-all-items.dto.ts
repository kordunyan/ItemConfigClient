import { Field } from "../domain/field";

export class FieldForAllItemsDto {
    constructor(public field: Field, public fieldSets: any[]) {
    }
}