import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl} from '@angular/forms';
import {ItemFieldConfig} from 'src/app/shared/domain/item-field-config';
import {startWith, map, catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {FieldConfig} from '../../../shared/domain/field-config';
import {Language} from '../../../shared/domain/language';
import { ArrayUtils } from 'src/app/shared/utils/array-utils';
import { ItemFieldConfigManager } from 'src/app/shared/utils/item-field-config-manager';
import { MandatoryDataManager } from 'src/app/shared/utils/mandatory-data-manager';

@Component({
  selector: 'app-multiple-edit-dialog',
  templateUrl: './multiple-edit-dialog.component.html',
  styleUrls: ['./multiple-edit-dialog.component.css']
})
export class MultipleEditDialogComponent {

  itemFieldConfigNameInput = new FormControl();
  selectedItemFieldConfig: ItemFieldConfig;
  selectedItemFieldConfigCopy: ItemFieldConfig;
  filteredItemFieldConfigs: ItemFieldConfig[] = [];
  itemFieldConfigs: ItemFieldConfig[] = [];
  allItemFieldConfigsSelected = false;
  selectedInstructionFieldConfigs: FieldConfig[] = [];
  selectedInstructionLanguages: Language[] = [];
  mandatoryDataManager: MandatoryDataManager;

  constructor(
    public dialogRef: MatDialogRef<MultipleEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.selectedItemFieldConfig = data.selectedItemFieldConfig;
    this.selectedItemFieldConfigCopy = ItemFieldConfig.copyOnlyMandatoryData(this.selectedItemFieldConfig);
    this.itemFieldConfigs = this.filterSelectedItemFieldConfig(data.itemFieldConfigs);
    
    this.selectedInstructionFieldConfigs = data.selectedInstructionFieldConfigs;
    this.selectedInstructionLanguages = data.selectedInstructionLanguages;


    this.mandatoryDataManager = new MandatoryDataManager(data.instructionLanguages, data.instructionsFields);

    this.initFilter();
  }

  initFilter() {
    this.itemFieldConfigNameInput.valueChanges.pipe(
      startWith(''),
      map(filterValue => {
        try {
          return new RegExp(filterValue, 'i');
        } catch (e) {
          return new RegExp('', 'i');
        }
      }),
      map(regexp => this._filter(regexp))
    ).subscribe(result => {
      this.filteredItemFieldConfigs = result;
      this.updateAllItemFieldConfigsSelected();
    });
  }

  _filter(filterRegexp: RegExp): ItemFieldConfig[] {
    return this.itemFieldConfigs.filter(fieldConfig => filterRegexp.test(fieldConfig.fieldConfig.name));
  }

  filterSelectedItemFieldConfig(itemFieldConfigs: ItemFieldConfig[]) {
    return itemFieldConfigs.filter(fieldConfig => fieldConfig.id !== this.selectedItemFieldConfig.id)
  }

  selectDeselectAll() {
    this.filteredItemFieldConfigs.forEach(fieldConfig => fieldConfig.checked = this.allItemFieldConfigsSelected);
  }

  getSelectedFilteredItemFieldConfigs(): ItemFieldConfig[] {
    return this.filteredItemFieldConfigs.filter(fieldConfig => fieldConfig.checked);
  }

  updateAllItemFieldConfigsSelected() {
    this.allItemFieldConfigsSelected = this.getSelectedFilteredItemFieldConfigs().length === this.filteredItemFieldConfigs.length;
  }

  close() {
    this.dialogRef.close();
  }

  select(itemFieldConfig: ItemFieldConfig) {
    itemFieldConfig.checked = !itemFieldConfig.checked;
    this.updateAllItemFieldConfigsSelected();
  }

  getSelectedItemFieldConfigs(): ItemFieldConfig[] {
    return this.itemFieldConfigs.filter(itemFieldConfig => itemFieldConfig.checked);
  }

  copyOnlyNewMandatoryData() {
    ItemFieldConfigManager.copyMandatoryData(this.selectedItemFieldConfigCopy, this.selectedItemFieldConfig);
    const selectedItemFieldConfigs = this.getSelectedItemFieldConfigs(); 
    if (ArrayUtils.isNotEmpty(selectedItemFieldConfigs)) {
      this.mandatoryDataManager.copyNewMandatoryData(selectedItemFieldConfigs, this.selectedItemFieldConfig);
    }
    this.close();
  }

  copyAllMandatoryData() {
    ItemFieldConfigManager.copyMandatoryData(this.selectedItemFieldConfigCopy, this.selectedItemFieldConfig);
    const selectedItemFieldConfigs = this.getSelectedItemFieldConfigs(); 
    if (ArrayUtils.isNotEmpty(selectedItemFieldConfigs)) {
      this.mandatoryDataManager.copyAllMandatoryData(selectedItemFieldConfigs, this.selectedItemFieldConfig);
    }
    this.close(); 
  }

}
