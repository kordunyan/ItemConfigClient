import {MultipleField} from '../domain/multiple-field';

export class ItemFieldsCriteria {
  constructor(
    public saveForAllStrategy?: string,
    public multipleFields?: MultipleField[],
    public withBatchType = false,
    public ipps = false,
    public sb = false
  ) {
  }
}
