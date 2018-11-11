import {Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter} from '@angular/core';
import {MandatoryField} from 'src/app/shared/domain/mandatory-field';
import {FieldConfig} from 'src/app/shared/domain/field-config';
import {DialogService} from 'src/app/shared/service/dialog.service';
import { Field } from 'src/app/shared/domain/field';

@Component({
  selector: 'app-add-mandatory-field',
  templateUrl: './add-mandatory-field.component.html',
  styleUrls: ['./add-mandatory-field.component.css']
})
export class AddMandatoryFieldComponent implements OnChanges {

  @Input('mandatoryFields') mandatoryFields: MandatoryField[];
  @Input('instructionsFieldConfigs') instructionsFieldConfigs: FieldConfig[];

  @Output('addNewData') addNewData = new EventEmitter<string[]>();
  fieldConfigsToSelect: FieldConfig[] = [];

  constructor(private dialogService: DialogService) {
  }

  ngOnChanges(changes: SimpleChanges) {
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
