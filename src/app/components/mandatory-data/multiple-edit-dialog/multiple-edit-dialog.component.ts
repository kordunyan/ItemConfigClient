import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl} from '@angular/forms';
import {ItemFieldConfig} from 'src/app/shared/domain/item-field-config';
import {startWith, map, catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import {FieldConfig} from '../../../shared/domain/field-config';
import {Language} from '../../../shared/domain/language';

@Component({
  selector: 'app-multiple-edit-dialog',
  templateUrl: './multiple-edit-dialog.component.html',
  styleUrls: ['./multiple-edit-dialog.component.css']
})
export class MultipleEditDialogComponent implements OnInit {

  itemFieldConfigNameInput = new FormControl();
  selectedItemFieldConfig: ItemFieldConfig;
  filteredItemFieldConfigs: ItemFieldConfig[] = [];
  itemFieldConfigs: ItemFieldConfig[] = [];
  itemFieldConfigsMap: {};
  allItemFieldConfigsSelected = false;
  selectedInstructionFieldConfigs: FieldConfig[] = [];
  selectedInstructionLanguages: Language[] = [];

  constructor(
    public dialogRef: MatDialogRef<MultipleEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    console.log(data);
    this.selectedItemFieldConfig = data.selectedItemFieldConfig;
    this.createItemFieldConfigCopy(data.itemFieldConfigs);
    this.createItemFieldConfigsMap(data.itemFieldConfigs);
    this.selectedInstructionFieldConfigs = data.selectedInstructionFieldConfigs;
    this.selectedInstructionLanguages = data.selectedInstructionLanguages;
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

  createItemFieldConfigsMap(itemFieldConfigs: ItemFieldConfig[]) {
    this.itemFieldConfigsMap = {};
    itemFieldConfigs.forEach(fieldConfig => {
      this.itemFieldConfigsMap[fieldConfig.id] = fieldConfig;
    });
  }

  createItemFieldConfigCopy(itemFieldConfigs: ItemFieldConfig[]) {
    this.itemFieldConfigs = itemFieldConfigs
      .filter(fieldConfig => fieldConfig.id !== this.selectedItemFieldConfig.id)
      .map(fieldConfig => ItemFieldConfig.copyOnlyMandatoryData(fieldConfig));
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

  ngOnInit() {
  }

  onCancel() {
    this.dialogRef.close();
  }

  select(itemFieldConfig: ItemFieldConfig) {
    itemFieldConfig.checked = !itemFieldConfig.checked;
    this.updateAllItemFieldConfigsSelected();
  }

}
