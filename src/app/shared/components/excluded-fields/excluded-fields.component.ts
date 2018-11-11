import {Component, Input, Output, EventEmitter} from '@angular/core';
import {FieldConfig} from '../../../shared/domain/field-config';
import { DialogService } from '../../service/dialog.service';

@Component({
  selector: 'app-excluded-fields',
  templateUrl: './excluded-fields.component.html',
  styleUrls: ['./excluded-fields.component.css']
})
export class ExcludedFieldsComponent {

  @Input('fieldConfigs') fieldConfigs: FieldConfig[] = [];
  @Output('onChoseFields') onChooseFields = new EventEmitter<FieldConfig[]>();

  constructor(
    private dialogService: DialogService
  ) {
  }

  openChooseFieldDialog() {
    this.dialogService.openOptionsSelectDialog(this.fieldConfigs, 'Selected Fields', (field) => field.name)
      .subscribe(selectedFields => {
        this.onChooseFields.emit(selectedFields);
    });
  }
}
