import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Field } from '../../../shared/domain/field';
import { FieldService } from '../../../shared/service/field.service';
import {DialogService} from '../../../shared/service/dialog.service';
import {FieldHttpService} from '../../../shared/service/http/field-http.service';
import {ItemFieldCrudOperationsDto} from '../../../shared/dto/item-field-crud-operations.dto';
import {ProgressBarService} from '../../../shared/service/progress-bar.service';
import {MessageService} from '../../../shared/service/message.service';
import {Item} from '../../../shared/domain/item';
import {ItemManager} from '../../../shared/utils/item.manager';
import {AppProperties} from '../../../shared/domain/app-properties';

@Component({
  selector: 'app-new-item-fields',
  templateUrl: './new-item-fields.component.html',
  styleUrls: ['./new-item-fields.component.css']
})
export class NewItemFieldsComponent implements OnInit {

  @Input('fields') fields: Field[] = [];
  @Input('item') item: Item;
  @Output('onFieldChanged') onFieldChanged = new EventEmitter();

  constructor(
    private fieldService: FieldService,
    private dialogService: DialogService,
    private fieldHttpService: FieldHttpService,
    private progressBarService: ProgressBarService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
  }

  onSaveAllForItem() {
     this.dialogService.openSaveForAllStrategyDialog().subscribe((saveForAllStrategy) => {
       let dto = new ItemFieldCrudOperationsDto([this.getItemNumber()], this.getNonEmptyFields(), saveForAllStrategy);
       this.saveField(dto);
     });
  }

  saveByItemNumbers() {
    this.dialogService.openItemNumbersAndSaveStrategyDialog()
      .subscribe((result) => {
        result.itemNumbers.push(this.getItemNumber());
        let dto = new ItemFieldCrudOperationsDto(result.itemNumbers, this.getNonEmptyFields(), result.saveForAllStrategy);
        this.saveField(dto);
      });
  }

  getItemNumber(): string {
    return ItemManager.getItemFieldValue(this.item, AppProperties.FIELD_D2COMM_ITEM_NUMBER);
  }

  saveField(dto: ItemFieldCrudOperationsDto) {
    this.progressBarService.show();
    this.fieldHttpService.saveForItems(dto).subscribe(
      (result) => {
        this.progressBarService.hide();
        this.onFieldChanged.emit();
        this.messageService.success(`Item fields were successfully updated`);
      },
      (error) => {
        this.progressBarService.hide();
      }
    );
  }

  onSaveClick() {
    let newFields = this.getNonEmptyFields();
    if (newFields.length > 0) {
      this.progressBarService.show();
      newFields.forEach(field => field.fieldSet = this.item.fieldSet);
      this.fieldHttpService.saveAll(newFields).subscribe((result) => {
        this.progressBarService.hide();
        this.onFieldChanged.emit();
      }, (error) => {
        this.progressBarService.hide();
      });
    }
  }

  getNonEmptyFields() {
    return this.fieldService.filterEmptyFields(this.fields);
  }

}
