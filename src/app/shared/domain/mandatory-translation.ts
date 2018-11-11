import { Language } from "./language";

export class MandatoryTranslation {
    constructor(
        public language: Language,
        public selected: boolean = false,
        public id?: number
    ) {

    }

    public static copyWithoutId(src: MandatoryTranslation): MandatoryTranslation {
        return new MandatoryTranslation(src.language);
    }
}