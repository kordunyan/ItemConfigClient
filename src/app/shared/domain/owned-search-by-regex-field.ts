import { SearchByRegexField } from "./search-by-regex-field";

export class OwnedSearchByRegexField extends SearchByRegexField {
    constructor(
        fieldName: string,
        regex: string = '',
        public invalidOwner: boolean = false
    ) {
        super(fieldName, regex);
    }
}