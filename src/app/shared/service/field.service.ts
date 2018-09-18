import {Injectable} from '@angular/core';
import {Field} from '../domain/field';
import {MultipleField} from '../domain/multiple-field';
import {FieldConfig} from '../domain/field-config';
import {AppProperties} from '../domain/app-properties';
import {FieldHttpService} from './http/field-http.service';
import {Item} from '../domain/item';
import {Observable} from 'rxjs';
import {NewFieldsDTO} from '../dto/new-fields.dto';
import {FieldForAllItemsDto} from '../dto/field-for-all-items.dto';

@Injectable({
  providedIn: 'root',
})
export class FieldService {

  constructor(private fieldHttpService: FieldHttpService) {

  }

  public saveFieldsForItem(fields: Field[], item: Item): Observable<any> {
    fields.forEach(field => field.fieldSet = item.fieldSet);
    return this.fieldHttpService.saveAll(fields);
  }

  public filterEmptyFields(fields: Field[]): Field[] {
    return fields.filter(f => f.value.length > 0);
  }

  public filterEmptyMultipleFiels(fields: MultipleField[]): MultipleField[] {
    return fields.filter(f => f.values.length);
  }

  public isDefaultExcluded(fieldConfig: FieldConfig) {
    return AppProperties.DEFAULT_EXLUDED_FIELDS.indexOf(fieldConfig.name) > -1;
  }
}
