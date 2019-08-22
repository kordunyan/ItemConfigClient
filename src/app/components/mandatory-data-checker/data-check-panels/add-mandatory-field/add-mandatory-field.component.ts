import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FieldConfig} from '../../../../shared/domain/field-config';
import {MandatoryField} from '../../../../shared/domain/mandatory-field';
import {DialogService} from '../../../../shared/service/dialog.service';

@Component({
  selector: 'app-add-mandatory-field',
  templateUrl: './add-mandatory-field.component.html',
  styleUrls: ['./add-mandatory-field.component.css']
})
export class AddMandatoryFieldComponent implements OnChanges {

  @Output() addNewData = new EventEmitter<string[]>();
  @Input() instructionsFieldConfigs: FieldConfig[];

  @Input() mandatoryFields: MandatoryField[];

  fieldConfigsToSelect: FieldConfig[] = [];

  constructor(private dialogService: DialogService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.fieldConfigsToSelect = this.instructionsFieldConfigs
      .filter(fieldConfig => this.mandatoryFields.findIndex(field =>
        field.fieldConfig.name === fieldConfig.name) < 0);
  }

  onAdd() {
    this.dialogService.openOptionsSelectDialog(this.fieldConfigsToSelect, 'Selected Fields', (field) => field.name)
      .subscribe(selectedFields => {
        this.addNewData.emit(selectedFields);
      });
  }

}
