import {Field} from './field';

export class MultipleField {
  constructor(
    public fieldConfigName: string,
    public values: string[],
  ) {

  }

  public static createFromField(field: Field): MultipleField {
    return new MultipleField(field.fieldConfigName, [field.value]);
  }
}
