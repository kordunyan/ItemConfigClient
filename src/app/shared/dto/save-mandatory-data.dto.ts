import {ItemFieldConfig} from '../domain/item-field-config';
import {MandatoryTranslation} from '../domain/mandatory-translation';
import { Item } from '../domain/item';
import {ItemFieldsCriteria} from './item-fields-criteria.dto';

export class SaveMandatoryDataDto {
  constructor(
    public itemFieldConfigs: ItemFieldConfig[],
    public saveForAll: boolean,
    public itemNumbers?: string[],
    public itemFieldsCriteria?: ItemFieldsCriteria
  ) {
  }
}
