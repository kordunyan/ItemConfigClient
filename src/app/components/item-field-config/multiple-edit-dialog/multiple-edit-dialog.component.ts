import {Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent} from '@angular/material';
import {ItemFieldConfig} from '../../../shared/domain/item-field-config';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {debounceTime, map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-multiple-edit-dialog',
  templateUrl: './multiple-edit-dialog.component.html',
  styleUrls: ['./multiple-edit-dialog.component.css']
})
export class MultipleEditDialogComponent {
  fieldConfigNameInput = new FormControl();
  itemFieldConfigs: ItemFieldConfig[];
  filteredItemFieldConfigs: Observable<ItemFieldConfig[]>;

  selectedItemFieldConfig: ItemFieldConfig;
  fieldConfigNameRegex = 'GARMENT_PART_MAIN_[0-9]$';
  matchedItemFieldConfigs: ItemFieldConfig[] = [];

  constructor(
    public dialogRef: MatDialogRef<MultipleEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.itemFieldConfigs = data.itemFieldConfigs;

    this.filteredItemFieldConfigs = this.fieldConfigNameInput.valueChanges.pipe(
      debounceTime(200),
      startWith<string>(''),
      map(fieldConfigName => {
        return fieldConfigName ? this._filter(fieldConfigName) : this.itemFieldConfigs.slice();
      })
    );

  }

  searchFieldConfigsByregex() {
    const regex = new RegExp(this.fieldConfigNameRegex);
    this.matchedItemFieldConfigs = this.itemFieldConfigs.filter(itemFieldConfig => {
      return regex.test(itemFieldConfig.fieldConfigName)
        && itemFieldConfig.fieldConfigName !== this.selectedItemFieldConfig.fieldConfigName;
    });
  }

  onFieldConfigSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedItemFieldConfig = this.getItemFieldConfig(event.option.value);
  }

  getItemFieldConfig(fieldConfigName) {
    return this.itemFieldConfigs.find(itemFieldConfig => itemFieldConfig.fieldConfigName === fieldConfigName);
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
