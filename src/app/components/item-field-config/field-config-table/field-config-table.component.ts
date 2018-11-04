import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {ItemFieldConfig} from '../../../shared/domain/item-field-config';
import {MatCheckboxChange, MatTableDataSource} from '@angular/material';
import {DialogService} from '../../../shared/service/dialog.service';

@Component({
  selector: 'app-field-confog-table',
  templateUrl: './field-config-table.component.html',
  styleUrls: ['./field-config-table.component.css']
})
export class FieldConfigTableComponent implements OnInit, OnChanges {
  displayedColumns: string[] = ['fieldConfigName', 'active', 'required', 'editable', 'dataSourceName', 'predefinedValue',
    'filterRegex', 'storeLastUserInput', 'canAddLater'];
  
  dataSource: MatTableDataSource<ItemFieldConfig>;
  filterValue: string;

  @Input('itemFieldConfigs') itemFieldConfigs: ItemFieldConfig[];
  @Input('withSelection') withSelection = true;
  @Input('instructionsFields') instructionsFields = {};


  allItemsSelected = false;

  constructor() {
  }

  ngOnInit() {
    if (this.withSelection) {
      this.displayedColumns.push('checked');
    }
    this.initDataSource();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.initDataSource();
  }

  initDataSource() {
    this.dataSource = new MatTableDataSource(this.itemFieldConfigs);
    this.dataSource.filterPredicate = (data, filter) => {
      return data.fieldConfig.name.toLowerCase().indexOf(filter) >= 0;
    };
    if (this.filterValue) {
      this.filterItemFieldConfigs();
    }
  }

  filterItemFieldConfigs() {
    this.dataSource.filter = this.filterValue.trim().toLocaleLowerCase();
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
