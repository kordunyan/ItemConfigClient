import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {SaveForAllDialogComponent} from '../../components/item-field-config/save-for-all-dialog/save-for-all-dialog.component';
import {Observable} from 'rxjs';
import {filter, flatMap, map} from 'rxjs/operators';
import {DeleteDialog} from '../components/delete-dialog/delete-dialog.component';
import {FilterRegexDialogComponent} from '../../components/item-field-config/filter-regex-dialog/filter-regex-dialog.component';
import {ItemFieldConfig} from '../domain/item-field-config';
import {SelectValuesDialogComponent} from '../components/select-values-dialog/select-values-dialog.component';
import { OptionsSelectDialog } from '../components/options-select-dialog/options-select-dialog';
import { ArrayUtils } from '../utils/array-utils';
import { ItemHttpService } from './http/item-http.service';
import { ProgressBarService } from './progress-bar.service';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private progressBarService: ProgressBarService,
    private itemService: ItemHttpService,
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
    this.progressBarService.show();
    return this.itemService.getAllItemValues()
      .pipe(
        flatMap(itemNumbers => {
          this.progressBarService.hide();
          return this.openOptionsSelectDialog(itemNumbers, 'Select Item Number', (name) => name)
        }) 
      );
  }

  openOptionsSelectDialog(options: any[], title: string, getFieldValueFunction): Observable<any[]> {
    return this.dialog.open(OptionsSelectDialog, {
      width: '500px',
      data: {
        options: options,
        title: title,
        getFieldValueFunction: getFieldValueFunction
      }
    }).beforeClose()
    .pipe(
      filter(result => ArrayUtils.isNotEmpty(result))
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
