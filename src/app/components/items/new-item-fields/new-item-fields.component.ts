import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Field } from '../../../shared/domain/field';
import { FieldService } from '../../../shared/service/field.service';

@Component({
  selector: 'app-new-item-fields',
  templateUrl: './new-item-fields.component.html',
  styleUrls: ['./new-item-fields.component.css']
})
export class NewItemFieldsComponent implements OnInit {

  @Input('fields') fields: Field[] = [];
  @Output('onSave') onSave = new EventEmitter<Field[]>();
  @Output('onSaveForAll') onSaveForAll = new EventEmitter<Field[]>();

  constructor(
    private fieldService: FieldService
  ) { }

  ngOnInit() {
  }

  onSaveAllForItem() {
    this.onSaveForAll.emit(this.getNonEmptyFields());  
  }

  onSaveClick() {
    this.onSave.emit(this.getNonEmptyFields());
  }

  getNonEmptyFields() {
    return this.fieldService.filterEmptyFields(this.fields);
  }

}
