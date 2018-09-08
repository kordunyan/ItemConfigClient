import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ItemFieldConfigHolder} from '../../../shared/utils/item-field-config-holder';
import {ItemFieldConfig} from '../../../shared/domain/item-field-config';
import {MatCheckboxChange} from '@angular/material';

@Component({
  selector: 'app-item-field-configs-table',
  templateUrl: './item-field-configs-table.component.html',
  styleUrls: ['./item-field-configs-table.component.css']
})
export class ItemFieldConfigsTableComponent implements OnInit {

  @Input('itemFieldConfigs') itemFieldConfigs: ItemFieldConfig[];
  @Input('withSelection') withSelection = true;

  allItemsSelected = false;

  constructor() {
  }

  ngOnInit() {
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
