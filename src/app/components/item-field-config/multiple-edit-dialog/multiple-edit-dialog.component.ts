import {Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent} from '@angular/material';
import {ItemFieldConfig} from '../../../shared/domain/item-field-config';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {debounceTime, map, startWith} from 'rxjs/operators';
import {ItemFieldConfigHolder} from '../../../shared/utils/item-field-config-holder';
import {ItemFieldConfigManager} from '../../../shared/utils/item-field-config-manager';

@Component({
  selector: 'app-multiple-edit-dialog',
  templateUrl: './multiple-edit-dialog.component.html',
  styleUrls: ['./multiple-edit-dialog.component.css']
})
export class MultipleEditDialogComponent {
  fieldConfigNameInput = new FormControl();
  itemFieldConfigs: ItemFieldConfig[];
  filteredItemFieldConfigs: Observable<ItemFieldConfig[]>;
  instructionsFields = {};

  selectedItemFieldConfig: ItemFieldConfig;
  selectedItemFieldConfigCopy: ItemFieldConfig;
  fieldConfigNameRegex = '';
  matchedItemFieldConfigsCopy: ItemFieldConfig[] = [];
  matchedFieldConfigsMap = {};


  constructor(
    public dialogRef: MatDialogRef<MultipleEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.itemFieldConfigs = data.itemFieldConfigs;
    this.instructionsFields = data.instructionsFields;

    this.filteredItemFieldConfigs = this.fieldConfigNameInput.valueChanges.pipe(
      debounceTime(200),
      startWith<string>(''),
      map(fieldConfigName => {
        return fieldConfigName ? this._filter(fieldConfigName) : this.itemFieldConfigs.slice();
      })
    );
  }

  onChangeFieldValue(fieldName) {
    if (this.matchedItemFieldConfigsCopy.length === 0) {
      return;
    }
    this.matchedItemFieldConfigsCopy.forEach(fieldConfig => fieldConfig[fieldName] = this.selectedItemFieldConfigCopy[fieldName]);
  }

  onChangeFilterRegex() {
    this.matchedItemFieldConfigsCopy.filter(fieldConfig => !fieldConfig.isTextField)
      .forEach(fieldConfig => {
        fieldConfig.filterRegex = this.selectedItemFieldConfigCopy.filterRegex;
      });
  }

  searchFieldConfigsByregex() {
    const regex = new RegExp(this.fieldConfigNameRegex, "i");
    const matchedFieldConfigs = this.itemFieldConfigs.filter(itemFieldConfig => {
      const fieldConfigName = itemFieldConfig.fieldConfig.name;
      return regex.test(fieldConfigName) && fieldConfigName !== this.selectedItemFieldConfig.fieldConfig.name;
    });

    this.matchedFieldConfigsMap = ItemFieldConfigHolder.createItemFieldConfigMap(matchedFieldConfigs);
    ItemFieldConfigHolder.copyItemFieldConfigs(matchedFieldConfigs, this.matchedItemFieldConfigsCopy);
    this.matchedItemFieldConfigsCopy = this.matchedItemFieldConfigsCopy.slice();
  }

  onFieldConfigSelected(event: MatAutocompleteSelectedEvent) {
    this.clearSelection();
    this.selectedItemFieldConfig = this.getItemFieldConfig(event.option.value);
    this.selectedItemFieldConfigCopy = ItemFieldConfig.copy(this.selectedItemFieldConfig);
  }

  onApplyConfigs() {
    this.matchedItemFieldConfigsCopy.forEach(itemFieldConfigCopy => {
      ItemFieldConfig.copyValuesWithoutegex(this.selectedItemFieldConfigCopy, itemFieldConfigCopy);
      if (!itemFieldConfigCopy.isTextField && !this.selectedItemFieldConfigCopy.isTextField) {
        itemFieldConfigCopy.filterRegex = this.selectedItemFieldConfigCopy.filterRegex;
      }
    });
  }

  clearSelection() {
    this.selectedItemFieldConfig = null;
    this.selectedItemFieldConfigCopy = null;
    this.matchedItemFieldConfigsCopy = [];
  }

  updateChangedFields() {
    if (this.matchedItemFieldConfigsCopy.length === 0) {
      this.dialogRef.close();
      return;
    }
    ItemFieldConfig.copyValues(this.selectedItemFieldConfigCopy, this.selectedItemFieldConfig);
    this.matchedItemFieldConfigsCopy.forEach(itemFieldConfigCopy => {
      let originItemFieldConfig = this.matchedFieldConfigsMap[itemFieldConfigCopy.fieldConfig.name];
      originItemFieldConfig.changed = ItemFieldConfigManager.noEquals(itemFieldConfigCopy, originItemFieldConfig);
      ItemFieldConfig.copyValues(itemFieldConfigCopy, originItemFieldConfig);
    });
    this.dialogRef.close();
  }

  getItemFieldConfig(fieldConfigName) {
    return this.itemFieldConfigs.find(itemFieldConfig => itemFieldConfig.fieldConfig.name === fieldConfigName);
  }

  private _filter(fieldConfigName: string): ItemFieldConfig[] {
    const inLowerCase = fieldConfigName.toLocaleLowerCase();
    return this.itemFieldConfigs.filter(itemFieldConfig => {
      return itemFieldConfig.fieldConfig.name.toLocaleLowerCase().startsWith(inLowerCase);
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
