import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Field } from '../../../shared/domain/field';
import { FieldService } from '../../../shared/service/field.service';
import {FieldHttpService} from '../../../shared/service/http/field-http.service';
import {ItemFieldCrudOperationsDto} from '../../../shared/dto/item-field-crud-operations.dto';
import {ProgressBarService} from '../../../shared/service/progress-bar.service';
import {MessageService} from '../../../shared/service/message.service';
import {Item} from '../../../shared/domain/item';
import {ItemManager} from '../../../shared/utils/item.manager';
import { ArrayUtils } from 'src/app/shared/utils/array-utils';

@Component({
  selector: 'app-new-item-fields',
  templateUrl: './new-item-fields.component.html',
  styleUrls: ['./new-item-fields.component.css']
})
export class NewItemFieldsComponent {

  @Input('fields') fields: Field[] = [];
  @Input('item') item: Item;
  @Output('onFieldChanged') onFieldChanged = new EventEmitter();

  constructor(
    private progressBarService: ProgressBarService,
    private fieldHttpService: FieldHttpService,
    private messageService: MessageService,
    private fieldService: FieldService
  ) { }

  saveForAll(saveOptions: any) {
    const newFields = this.getNonEmptyFields();
    if (ArrayUtils.isEmpty(newFields)) {
      return;
    }
    let itemNumbers = [ItemManager.getItemNumber(this.item)];
    if (ArrayUtils.isNotEmpty(saveOptions.itemNumbers)) {
      itemNumbers = itemNumbers.concat(saveOptions.itemNumbers);
    }
    const dto = new ItemFieldCrudOperationsDto(itemNumbers, newFields, saveOptions.fieldsCriteria);
    this.saveFields(dto);
  }

  saveFields(dto: ItemFieldCrudOperationsDto) {
    this.progressBarService.show();
    this.fieldHttpService.saveForItems(dto).subscribe(
      (result) => {
        this.progressBarService.hide();
        this.onFieldChanged.emit();
        this.messageService.success(`Item fields were successfully updated`);
      }, () => this.progressBarService.hide());
  }

  onSaveClick() {
    let newFields = this.getNonEmptyFields();
    if (ArrayUtils.isEmpty(newFields)) {
      return;
    }
    this.progressBarService.show();
    newFields.forEach(field => field.fieldSet = this.item.fieldSet);
    this.fieldHttpService.saveAll(newFields).subscribe((result) => {
      this.progressBarService.hide();
      this.onFieldChanged.emit();
    }, () => this.progressBarService.hide());
  }

  getNonEmptyFields() {
    return this.fieldService.filterEmptyFields(this.fields);
  }
}
