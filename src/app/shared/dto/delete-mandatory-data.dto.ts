export class DeleteMandatoryDataDto {
  public translationsToDeleteByFieldName: {};
  public fieldsToDeleteByFieldName: {};

  constructor(
    public deleteForAll: boolean,
    public itemNumbers?: string[]
  ) {

  }
}
