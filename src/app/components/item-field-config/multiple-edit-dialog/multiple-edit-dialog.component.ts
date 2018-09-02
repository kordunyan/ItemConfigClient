import {Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ItemFieldConfig} from '../../../shared/domain/item-field-config';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-multiple-edit-dialog',
  templateUrl: './multiple-edit-dialog.component.html',
  styleUrls: ['./multiple-edit-dialog.component.css']
})
export class MultipleEditDialogComponent {
  fieldConfigNameInput = new FormControl();
  itemFieldConfigs: ItemFieldConfig[];
  filteredItemFieldConfigs: Observable<ItemFieldConfig[]>;

  constructor(
    public dialogRef: MatDialogRef<MultipleEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.itemFieldConfigs = data.itemFieldConfigs;

    this.filteredItemFieldConfigs = this.fieldConfigNameInput.valueChanges.pipe(
      startWith<string>(''),
      map(fieldConfigName => {
        return fieldConfigName ? this._filter(fieldConfigName) : this.itemFieldConfigs.slice();
      })
    );

  }

  private _filter(fieldConfigName: string): ItemFieldConfig[] {
    const inLowerCase = fieldConfigName.toLocaleLowerCase();
    return this.itemFieldConfigs.filter(itemFieldConfig => {
      return itemFieldConfig.fieldConfigName.toLocaleLowerCase().startsWith(inLowerCase);
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
