import { Field } from "../domain/field";

export class NewFieldsDTO {
    constructor(public fields: Field[], public fieldSets: any[]) {
    }
}