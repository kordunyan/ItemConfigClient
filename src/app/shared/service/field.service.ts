import {Injectable} from '@angular/core';
import {Field} from '../domain/field';
import {MultipleField} from '../domain/multiple-field';
import {FieldConfig} from '../domain/field-config';
import {AppProperties} from '../domain/app-properties';
import {FieldHttpService} from './http/field-http.service';
import {Item} from '../domain/item';
import {Observable, of} from 'rxjs';
import {NewFieldsDTO} from '../dto/new-fields.dto';
import {FieldForAllItemsDto} from '../dto/field-for-all-items.dto';
import { RboHttpService } from './http/rbo-http.service';
import { RboCodeService } from './rbo-code.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FieldService {

  private multipleFieldNames: string[] = [];
  private currentRboCode: string;

  constructor(
      private fieldHttpService: FieldHttpService,
      public rboHttpService: RboHttpService,
      public rboCodeService: RboCodeService
    ) {
  }

  private changedRboCode(): boolean {
      return this.currentRboCode !== this.rboCodeService.getCurrentCode();
  }

  public getMultipleFieldNames(): Observable<string[]> {
    if (this.changedRboCode()) {
      this.currentRboCode = this.rboCodeService.getCurrentCode();
      return this.rboHttpService.getMultipleFields()
      .pipe(
        tap(result => {
          if (result && result.length > 0) {
            this.multipleFieldNames = result;
          } else {
            this.multipleFieldNames = [];
          }
        })
      );
    }
    return of(this.multipleFieldNames);
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
