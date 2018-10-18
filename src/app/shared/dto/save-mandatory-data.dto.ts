import {ItemFieldConfig} from '../domain/item-field-config';
import {MandatoryTranslation} from '../domain/mandatory-translation';

export class SaveMandatoryDataDto {
  constructor(
    public itemFieldConfig: ItemFieldConfig,
    public saveForAll: boolean,
    public newMandatoryTrnaslations?: MandatoryTranslation[],
    public saveForAllStrategy?: string
  ) {
  }
}
