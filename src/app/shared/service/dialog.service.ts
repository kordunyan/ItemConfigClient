import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {SaveForAllDialogComponent} from '../../components/item-field-config/save-for-all-dialog/save-for-all-dialog.component';
import {Observable} from 'rxjs';
import {ItemNumbersSelectDialog} from '../components/item-numbers-select-dialog/item-numbers-select-dialog';
import {filter, flatMap, map} from 'rxjs/operators';
import {DeleteDialog} from '../components/delete-dialog/delete-dialog.component';
import {FilterRegexDialogComponent} from '../../components/item-field-config/filter-regex-dialog/filter-regex-dialog.component';
import {ItemFieldConfig} from '../domain/item-field-config';
import {SelectValuesDialogComponent} from '../components/select-values-dialog/select-values-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    public dialog: MatDialog
  ) {
  }

  openSaveForAllStrategyDialog(): Observable<string> {
    return this.dialog.open(SaveForAllDialogComponent, {
      width: '300px'
    }).beforeClose()
      .pipe(
        filter(saveForAllStrategy => saveForAllStrategy !== undefined)
      );
  }

  openFilterRegexDialog(itemFieldConfig: ItemFieldConfig, instructionFields: string[]): Observable<any> {
    return this.dialog.open(FilterRegexDialogComponent, {
      width: '650px',
      data: {
        itemFieldConfig: itemFieldConfig,
        instructionFields: instructionFields
      }
    }).beforeClose()
    .pipe(
      filter(result => result)
    );
  }

  openItemNumberSelectDialog(): Observable<string[]> {
    return this.dialog.open(ItemNumbersSelectDialog, {
      width: '500px'
    }).beforeClose()
      .pipe(
        filter((itemNumbers) => itemNumbers && itemNumbers.length > 0)
      );
  }

  openItemNumbersAndSaveStrategyDialog(): Observable<any> {
    return this.openItemNumberSelectDialog().pipe(
      flatMap((itemNumbers) => {
        return this.openSaveForAllStrategyDialog().pipe(
          map(saveForAllStrategy => {
            return {
              saveForAllStrategy: saveForAllStrategy,
              itemNumbers: itemNumbers
            };
          })
        );
      })
    );
  }

  openDeleteDialog(all: boolean = true, withByItemNumbers: boolean = false): Observable<any> {
    return this.dialog.open(DeleteDialog, {
      data: {
        all: all,
        withByItemNumbers: withByItemNumbers
      },
      width: '300px'
    }).beforeClose()
      .pipe(
        filter(result => result !== undefined)
      );
  }

  openSelectValuesDialog(values: string[], title?: string): Observable<any> {
    return this.dialog.open(SelectValuesDialogComponent, {
      data: {
        allValues: values,
        title: title
      },
      width: '400px'
    }).beforeClose()
      .pipe(
        filter(result => result != null && result.length > 0)
      );
  }

}
