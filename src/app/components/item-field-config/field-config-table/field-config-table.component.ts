import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {ItemFieldConfig} from '../../../shared/domain/item-field-config';
import {MatCheckboxChange, MatTableDataSource} from '@angular/material';
import {DialogService} from '../../../shared/service/dialog.service';
import {DocumentUtils} from '../../../shared/utils/document-utils';
import {MessageService} from '../../../shared/service/message.service';

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

  constructor(
    private messageService: MessageService
  ) {
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
      let regex = null;
      try {
        regex = new RegExp(filter, 'i');
      } catch (e) {
        regex = new RegExp('', 'i');
      }
      return regex.test(data.fieldConfig.name);
    };
    if (this.filterValue) {
      this.filterItemFieldConfigs();
    }
  }

  clipboard(fieldConfigName) {
    if (DocumentUtils.clipboard(fieldConfigName)) {
      this.messageService.info(`Copied: ${fieldConfigName}`);
    }
  }

  filterItemFieldConfigs() {
    this.dataSource.filter = this.filterValue.trim().toLocaleLowerCase();
    this.updateAllItemSelected();
  }

  selectDeselectAll(change: MatCheckboxChange) {
    this.allItemsSelected = change.checked;
    this.dataSource.filteredData.forEach(itemFieldConfig => itemFieldConfig.checked = change.checked);
  }

  onChangeSelection() {
    this.updateAllItemSelected();
  }

  updateAllItemSelected() {
    this.allItemsSelected = this.getSelectedItemFieldConfigs().length === this.dataSource.filteredData.length;
  }

  getSelectedItemFieldConfigs(): ItemFieldConfig[] {
    return this.dataSource.filteredData.filter(itemFieldConfig => itemFieldConfig.checked === true);
  }
}
