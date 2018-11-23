import {Field} from '../domain/field';
import {ItemFieldsCriteria} from './item-fields-criteria.dto';

export class ItemFieldCrudOperationsDto {
  constructor(
    public itemNumbers: string[],
    public fields: Field[],
    public itemFieldsCriteria?: ItemFieldsCriteria
  ) {

  }
}
