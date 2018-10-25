import {Item} from '../domain/item';
import {FieldConfig} from '../domain/field-config';
import { ArrayUtils } from './array-utils';

export abstract class AbstractItemFieldConfigHolder {
  public noActiveFieldConfigs: FieldConfig[] = [];
  public fieldConfigMap = {};

  constructor(
    public item: Item,
    public fieldConfigs: FieldConfig[]
  ) {
    this.fieldConfigs.forEach((fieldConfig: FieldConfig) => this.fieldConfigMap[fieldConfig.name] = fieldConfig);  
  }

  abstract createNoActiveFieldConfigs();

  sortFieldConfigs(fieldConfigs: FieldConfig[]) {
    ArrayUtils.sort(fieldConfigs, (fieldConfig: FieldConfig) => fieldConfig.name.toLowerCase());
  }

  public removeNoActiveField(fieldConfigName: string) {
    this.noActiveFieldConfigs.splice(this.noActiveFieldConfigs.findIndex(fieldConfig => fieldConfig.name === fieldConfigName), 1);
  }
}
