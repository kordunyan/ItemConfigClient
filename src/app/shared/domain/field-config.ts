export class FieldConfig {

  public static readonly DEFAULT_NAME = '';
  public static readonly DEFAULT_TYPE = '';
  public static readonly DEFAULT_OWNER = '';
  public static readonly DEFAULT_IS_PRINTABLE = false;


  constructor(
    public name: string,
    public type: string,
    public owner: string,
    public printable: boolean
  ) {

  }

  public static copy(fieldConfig: FieldConfig) {
    return new FieldConfig(
      fieldConfig.name,
      fieldConfig.type,
      fieldConfig.owner,
      fieldConfig.printable
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
    return true;
  }

  public static default(): FieldConfig {
    return new FieldConfig(
      FieldConfig.DEFAULT_NAME,
      FieldConfig.DEFAULT_TYPE,
      FieldConfig.DEFAULT_OWNER,
      FieldConfig.DEFAULT_IS_PRINTABLE
    );
  }

}
