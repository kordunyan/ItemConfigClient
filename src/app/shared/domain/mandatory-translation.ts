import { Language } from "./language";

export class MandatoryTranslation {
    constructor(
        public language: Language,
        public selected: boolean = false,
        public id?: number
    ) {

    }
}