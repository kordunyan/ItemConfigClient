export class DeleteMandatoryDataDto {
    constructor(
        public translationsToDeleteByFieldName: {},
        public deleteForAll: boolean,
        public itemNumbers?: string[]
    ) {

    }
}