import {ItemFieldConfig} from './item-field-config';

export class FieldConfig {
  constructor(
    public name: string,
    public type: string,
    public owner: string,
    public printable: boolean,
    public multiple: boolean
  ) {

  }

  public static copy(fieldConfig: FieldConfig) {
    return new FieldConfig(
      fieldConfig.name,
      fieldConfig.type,
      fieldConfig.owner,
      fieldConfig.printable,
      fieldConfig.multiple
    );
  }

  public static equals(fieldA: FieldConfig, fieldB: FieldConfig): boolean {
    if (fieldA == null || fieldB == null) {
      return false;
    }
    if (fieldA.name !== fieldB.name) {
      return false;
    }
    if (fieldA.type !== fieldB.type) {
      return false;
    }
    if (fieldA.owner !== fieldB.owner) {
      return false;
    }
    if (fieldA.printable !== fieldB.printable) {
      return false;
    }
    if (fieldA.multiple !== fieldB.multiple) {
      return false;
    }
     return true;
  }
}
