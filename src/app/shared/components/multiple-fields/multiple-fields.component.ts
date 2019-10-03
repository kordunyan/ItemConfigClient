import {Component, OnInit, Input} from '@angular/core';
import {Item} from '../../domain/item';
import {ItemManager} from '../../utils/item.manager';
import {FieldService} from '../../service/field.service';
import {MessageService} from '../../service/message.service';
import {DocumentUtils} from '../../utils/document-utils';

@Component({
  selector: 'app-multiple-fields',
  templateUrl: './multiple-fields.component.html',
  styleUrls: ['./multiple-fields.component.css']
})
export class MultipleFieldsComponent implements OnInit {

  @Input('item') item: Item;
  @Input('multipleFields') multipleFields: string[];

  _multipleFields: string[] = [];

  constructor(
    private fieldService: FieldService,
    private messageService: MessageService
  ) {
  }

  ngOnInit() {
    if (this.multipleFields) {
      this._multipleFields = this.multipleFields;
    } else {
      this.fieldService.getMultipleFieldNames().subscribe(result => {
        this._multipleFields = result;
      });
    }
  }

  clipboard(fieldName) {
    const value = this.getItemFieldValue(fieldName);
    if (DocumentUtils.clipboard(value)) {
      this.messageService.info(`Copied: ${value}`);
    }
  }

  hasMultipleField(fieldName: string) {
    return !!ItemManager.getItemField(this.item, fieldName);
  }

  getItemFieldValue(fieldName: string): string {
    return ItemManager.getItemFieldValue(this.item, fieldName);
  }

}
