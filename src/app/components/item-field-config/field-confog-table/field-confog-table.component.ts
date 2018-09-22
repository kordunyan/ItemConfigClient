import { Component, Input, OnInit } from '@angular/core';
import { ItemFieldConfig } from '../../../shared/domain/item-field-config';
import { MatCheckboxChange } from '@angular/material';

@Component({
  selector: 'app-field-confog-table',
  templateUrl: './field-confog-table.component.html',
  styleUrls: ['./field-confog-table.component.css']
})
export class FieldConfogTableComponent implements OnInit{
  displayedColumns: string[] = ['fieldConfigName', 'active', 'required', 'editable', 'dataSourceName', 'predefinedValue', 
    'filterRegex', 'storeLastUserInput', 'canAddLater'];

  @Input('itemFieldConfigs') itemFieldConfigs: ItemFieldConfig[];
  @Input('withSelection') withSelection = true;

  allItemsSelected = false;

  constructor() { }

  ngOnInit() {
    if(this.withSelection) {
      this.displayedColumns.push('checked');
    }
  }

  selectDeselectAll(change: MatCheckboxChange) {
    this.allItemsSelected = change.checked;
    this.itemFieldConfigs.forEach(itemFieldConfig => itemFieldConfig.checked = change.checked);
  }

  onChangeSelection() {
    this.updateAllItemSelected();
  }

  updateAllItemSelected() {
    this.allItemsSelected = this.getSelectedItemFieldConfigs().length === this.itemFieldConfigs.length;
  }

  getSelectedItemFieldConfigs(): ItemFieldConfig[] {
    return this.itemFieldConfigs.filter(itemFieldConfig => itemFieldConfig.checked === true);
  }
}
