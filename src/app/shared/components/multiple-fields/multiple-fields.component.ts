import { Component, OnInit, Input } from '@angular/core';
import { Item } from '../../domain/item';
import { ItemManager } from '../../utils/item.manager';
import { FieldService } from '../../service/field.service';

@Component({
  selector: 'app-multiple-fields',
  templateUrl: './multiple-fields.component.html',
  styleUrls: ['./multiple-fields.component.css']
})
export class MultipleFieldsComponent implements OnInit {

  @Input('item') item: Item;
  @Input('multipleFields') multipleFields: string[];

  _multipleFields: string[] = [];

  constructor(private fieldService: FieldService) { }

  ngOnInit() {
    if (this.multipleFields) {
      this._multipleFields = this.multipleFields;
    } else {
      this.fieldService.getMultipleFieldNames().subscribe(result => {
        this._multipleFields = result;
      });
    }
  }

  getItemFieldValue(fieldName: string): string {
    return ItemManager.getItemFieldValue(this.item, fieldName);
  }

}
