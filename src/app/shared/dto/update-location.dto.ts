import { ItemFieldsCriteria } from "./item-fields-criteria.dto";

export class UpdateLocationDto {
  constructor(
    public itemNumbers: string[],
    public ipps: boolean,
    public sb: boolean,
    public itemFieldsCriteria?: ItemFieldsCriteria
  ) {
  }
}
