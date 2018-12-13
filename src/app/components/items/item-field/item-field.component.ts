import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Field} from '../../../shared/domain/field';
import {FieldHttpService} from '../../../shared/service/http/field-http.service';
import {ProgressBarService} from '../../../shared/service/progress-bar.service';
import {ItemFieldCrudOperationsDto} from '../../../shared/dto/item-field-crud-operations.dto';
import {DialogService} from '../../../shared/service/dialog.service';
import { Item } from 'src/app/shared/domain/item';
import { ItemManager } from 'src/app/shared/utils/item.manager';
import { ArrayUtils } from 'src/app/shared/utils/array-utils';
import { ItemFieldsCriteria } from 'src/app/shared/dto/item-fields-criteria.dto';
import {MessageService} from '../../../shared/service/message.service';
import {DocumentUtils} from '../../../shared/utils/document-utils';

@Component({
  selector: 'app-item-field',
  templateUrl: './item-field.component.html',
  styleUrls: ['./item-field.component.css']
})
export class ItemFieldComponent implements OnInit {

  @Input('field') field: Field;
  @Input('item') item: Item;
  @Output('onFieldDeleted') onFieldDeleted = new EventEmitter<Field>();
  @Output('onFieldChanged') onFieldChanged = new EventEmitter();

  isEdit = false;
  oldValue: string;
  isChangedValue = false;

  constructor(
    private fieldHttpService: FieldHttpService,
    private progressBarService: ProgressBarService,
    public dialogService: DialogService,
    private messageService: MessageService
  ) {
  }

  ngOnInit() {
    this.oldValue = this.field.value;
  }

  onEditClick() {
    this.checkForChanges();
    this.isEdit = true;
  }

  onCancelClick() {
    this.field.value = this.oldValue;
    this.isEdit = false;
  }

  clipborad() {
    if (DocumentUtils.clipboard(this.field.value)) {
      this.messageService.info(`Copied: ${this.field.value}`);
    }
  }

  onSaveClick() {
    this.progressBarService.show();
    this.fieldHttpService.update(this.field)
      .subscribe(
        (result) => {
          this.progressBarService.hide();
          this.oldValue = this.field.value;
          this.isEdit = false;
      },() => this.progressBarService.hide());
  }

  saveForAll(saveOptions: any) {
    let itemNumbers = [ItemManager.getItemNumber(this.item)];
    if (ArrayUtils.isNotEmpty(saveOptions.itemNumbers)) {
      itemNumbers = itemNumbers.concat(saveOptions.itemNumbers);
    }
    let dto = new ItemFieldCrudOperationsDto(itemNumbers, [this.field], saveOptions.fieldsCriteria);
    this.saveField(dto);
  }

  saveField(dto: ItemFieldCrudOperationsDto) {
    this.progressBarService.show();
    this.fieldHttpService.saveForItems(dto).subscribe(
      (result) => {
        this.progressBarService.hide();
        this.onFieldChanged.emit();
      }, () => this.progressBarService.hide());
  }

  onChangeValue() {
    this.checkForChanges();
  }

  checkForChanges() {
    this.isChangedValue = this.oldValue !== this.field.value;
  }

  onDelete() {
    this.progressBarService.show();
    this.fieldHttpService.delete(this.field).subscribe(
      (result) => {
        this.progressBarService.hide();
        this.onFieldDeleted.emit(this.field);
      }, (error) => this.progressBarService.hide()
    );
  }

  onDeleteForAll(selectdItemNumbers?: string[]) {
    this.dialogService.openSaveForAllConfigurationDialog(this.item, false)
      .subscribe(fieldsCriteria => {
        this.deleteForAll(fieldsCriteria, selectdItemNumbers);
      });
  }

  deleteForAll(fieldsCriteria: ItemFieldsCriteria, selectedItemNumbers?: string[]) {
    this.progressBarService.show();
    let itemNumbers = [ItemManager.getItemNumber(this.item)];
    if (ArrayUtils.isNotEmpty(selectedItemNumbers)) {
      itemNumbers = itemNumbers.concat(selectedItemNumbers);
    }
    const dto = new ItemFieldCrudOperationsDto(itemNumbers, [this.field], fieldsCriteria);
    this.fieldHttpService.deleteForALlItems(dto).subscribe(
      () => {
        this.progressBarService.hide();
        this.onFieldChanged.emit();
      },() => this.progressBarService.hide());
  }

}
