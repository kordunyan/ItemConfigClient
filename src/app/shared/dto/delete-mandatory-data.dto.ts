import { ItemFieldsCriteria } from "./item-fields-criteria.dto";

export class DeleteMandatoryDataDto {
  public translationsToDeleteByFieldName: {};
  public fieldsToDeleteByFieldName: {};

  constructor(
    public deleteForAll: boolean,
    public itemNumbers?: string[],
    public itemFieldsCriteria?: ItemFieldsCriteria
  ) {

  }
}
