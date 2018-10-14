import {Field} from '../domain/field';
import {Item} from '../domain/item';
import {FieldConfig} from '../domain/field-config';

export class ItemFieldsHolder {
  public multipleItemFields: Field[] = [];
  public itemFields: Field[] = [];

  public noActiveFieldConfigs: FieldConfig[] = [];
  public newItemFields: Field[] = [];

  constructor(public item: Item, public fieldConfigs: {}, public multipleFieldNames: string[]) {
    for (let fieldConfigName in fieldConfigs) {
      let fieldConfig = fieldConfigs[fieldConfigName];
      let field = this.findItemField(fieldConfig);
      if (field) {
        this.addItemField(field);
      } else {
        this.noActiveFieldConfigs.push(fieldConfig);
      }
    }
    this.sortFields(this.multipleItemFields);
    this.sortFields(this.itemFields);
  }

  public createNewItemFields(fieldConfigNames: string[]) {
    fieldConfigNames.forEach(fieldConfigName => {
      this.newItemFields.push(new Field(fieldConfigName, ''));
      this.removeNoActiveField(fieldConfigName);
    });
    this.sortFields(this.newItemFields);
  }

  public deleteField(field: Field) {
    this.removeFieldFromArray(this.item.fields, field);
    this.removeFieldFromArray(this.itemFields, field);
    this.noActiveFieldConfigs.push(this.fieldConfigs[field.fieldConfigName]);
  }

  private removeFieldFromArray(array: Field[], field: Field) {
    array.splice(array.findIndex(f => f.fieldConfigName === field.fieldConfigName), 1);
  }

  public removeNoActiveField(fieldConfigName: string) {
    this.noActiveFieldConfigs.splice(this.noActiveFieldConfigs.findIndex(fieldConfig => fieldConfig.name === fieldConfigName), 1);
  }

  public sortFields(fields: Field[]) {
    fields.sort((fieldA, fieldB) => {
      var a = fieldA.fieldConfigName.toLocaleLowerCase();
      var b = fieldB.fieldConfigName.toLocaleLowerCase();
      if (a === b) return 0;
      return (a > b) ? 1 : -1;
    });
  }

  public getMultipleFieldByName(fieldConfigName): Field {
    return this.multipleItemFields.find(field => field.fieldConfigName === fieldConfigName);
  }

  public addItemField(field: Field) {
    if (this.isMultiple(field.fieldConfigName)) {
      this.multipleItemFields.push(field);
    } else {
      this.itemFields.push(field);
    }
  }

  public isMultiple(fieldConfigName: string): boolean {
    return this.multipleFieldNames.findIndex(fieldName => fieldName === fieldConfigName) > -1;
  }

  public findItemField(fieldConfig: FieldConfig): Field {
    return this.item.fields.find(field => field.fieldConfigName === fieldConfig.name);
  }
}
