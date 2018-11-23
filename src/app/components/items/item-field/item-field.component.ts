import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Field} from '../../../shared/domain/field';
import {FieldHttpService} from '../../../shared/service/http/field-http.service';
import {ProgressBarService} from '../../../shared/service/progress-bar.service';
import {MessageService} from '../../../shared/service/message.service';
import {ItemFieldCrudOperationsDto} from '../../../shared/dto/item-field-crud-operations.dto';
import {DialogService} from '../../../shared/service/dialog.service';

@Component({
  selector: 'app-item-field',
  templateUrl: './item-field.component.html',
  styleUrls: ['./item-field.component.css']
})
export class ItemFieldComponent implements OnInit {

  @Input('field') field: Field;
  @Input('itemNumber') itemNumber: string;
  @Output('onFieldDeleted') onFieldDeleted = new EventEmitter<Field>();
  @Output('onFieldChanged') onFieldChanged = new EventEmitter();

  isEdit = false;
  oldValue: string;
  isChangedValue = false;

  constructor(
    private fieldHttpService: FieldHttpService,
    private progressBarService: ProgressBarService,
    private messageService: MessageService,
    public dialogService: DialogService
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

  onSaveClick() {
    this.progressBarService.show();
    this.fieldHttpService.update(this.field)
      .subscribe(
        (result) => {
          this.progressBarService.hide();
          this.oldValue = this.field.value;
          this.isEdit = false;
        },
        (error) => this.progressBarService.hide(),
      );
  }

  onSaveAllForItem() {
    this.dialogService.openSaveForAllConfigurationDialog().subscribe((saveForAllStrategy) => {
      if (saveForAllStrategy) {
        let dto = new ItemFieldCrudOperationsDto([this.itemNumber], [this.field], saveForAllStrategy);
        this.saveField(dto);
      }
    });
  }

  saveByItemNumbers() {
    this.dialogService.openItemNumbersAndSaveStrategyDialog().subscribe((result) => {
      result.itemNumbers.push(this.itemNumber);
      let dto = new ItemFieldCrudOperationsDto(result.itemNumbers, [this.field], result.saveForAllStrategy);
      this.saveField(dto);
    });
  }

  saveField(dto: ItemFieldCrudOperationsDto) {
    this.progressBarService.show();
    this.fieldHttpService.saveForItems(dto).subscribe(
      (result) => {
        this.progressBarService.hide();
        this.onFieldChanged.emit();
      },
      (error) => {
        this.progressBarService.hide();
      }
    );
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
      },
      (error) => this.progressBarService.hide()
    );
  }

  onDeleteForAll(selectdItemNumbers?: string[]) {
    let itemNumbers = [this.itemNumber];
    if (selectdItemNumbers && selectdItemNumbers.length > 0) {
      itemNumbers = itemNumbers.concat(selectdItemNumbers);
    }
    let dto = new ItemFieldCrudOperationsDto(itemNumbers, [this.field]);
    this.progressBarService.show();
    this.fieldHttpService.deleteForALlItems(dto).subscribe(
      (result) => {
        this.progressBarService.hide();
        this.onFieldChanged.emit();
      },
      (error) => this.progressBarService.hide()
    );
  }

}
