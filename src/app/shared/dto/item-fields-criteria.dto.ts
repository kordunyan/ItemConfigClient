import {MultipleField} from '../domain/multiple-field';

export class ItemFieldsCriteria {
  constructor(
    public saveForAllStrategy?: string,
    public multipleFields?: MultipleField[]
  ) {
  }
}
