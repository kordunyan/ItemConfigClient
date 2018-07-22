import { Component, OnInit, Input } from '@angular/core';
import { ItemFieldConfig } from '../../../shared/domain/item-field-config';

@Component({
  selector: '[app-field-config-row]',
  templateUrl: './field-config-row.component.html',
  styleUrls: ['./field-config-row.component.css']
})
export class FieldConfigRowComponent implements OnInit {

  @Input("itemFieldConfig") itemFieldConfig: ItemFieldConfig;

  constructor() { }

  ngOnInit() {
  }

}
