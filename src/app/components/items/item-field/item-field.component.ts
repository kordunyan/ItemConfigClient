import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Field } from '../../../shared/domain/field';
import { FieldConfigHttpService } from '../../../shared/service/http/field-config-http.service';
import { FieldHttpService } from '../../../shared/service/http/field-http.service';
import { ProgressBarService } from '../../../shared/service/progress-bar.service';
import { MessageService } from '../../../shared/service/message.service';
import { ItemFieldCrudOperationsDto } from '../../../shared/dto/item-field-crud-operations.dto';

@Component({
  selector: 'app-item-field',
  templateUrl: './item-field.component.html',
  styleUrls: ['./item-field.component.css']
})
export class ItemFieldComponent implements OnInit {

  @Input('field') field: Field;
  @Input('itemNumber') itemNumber: string;
  @Output('onAllUpdated') onAllUpdated: EventEmitter<any> = new EventEmitter();
  @Output('onFieldDeleted') onFieldDeleted = new EventEmitter<Field>();

  isEdit: boolean = false;
  oldValue: string;
  isChangedValue: boolean = false;

  constructor(
    private fieldHttpService: FieldHttpService,
    private progressBarService: ProgressBarService,
    private messageService: MessageService
  ) { }

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

    let dto = new ItemFieldCrudOperationsDto([this.itemNumber], [this.field]);
    this.saveField(dto);
    // this.progressBarService.show();
    // this.fieldHttpService.updateAllForItem(this.field)
    //   .subscribe(
    //     (result) => {
    //       this.progressBarService.hide();
    //       this.messageService.success(`${result} fields were successfully updated`);
    //       this.onAllUpdated.emit(null);
    //     },
    //     (error) => this.progressBarService.hide() 
    //   );
  }

  saveField(dto: ItemFieldCrudOperationsDto) {
    this.fieldHttpService.newSaveFields(dto).subscribe(
      (result) => {
        console.log(result);
      },
      (error) => {
        console.log(error);
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

  onDeleteForAll() {
    this.progressBarService.show();
    this.fieldHttpService.deleteForALlItems(this.field).subscribe(
      (result) => {
        this.progressBarService.hide();
        this.onAllUpdated.emit(null);
        this.messageService.success(`${result} fields were deleted`);
      },
      (error) => this.progressBarService.hide()
    );
  }

}
