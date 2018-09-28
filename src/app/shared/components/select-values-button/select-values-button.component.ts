import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DialogService} from '../../service/dialog.service';

@Component({
  selector: 'app-select-values-button',
  templateUrl: './select-values-button.component.html',
  styleUrls: ['./select-values-button.component.css']
})
export class SelectValuesButtonComponent {

  @Input('values') values: string[] = [];
  @Input('dialogTitle') dialogTitle: string;
  @Input('buttonCaption') buttonCaption: string;

  @Output('valuesSelected') valuesSelected = new EventEmitter<string[]>();

  constructor(
    private dialogService: DialogService
  ) {
  }

  onButnClick() {
    this.dialogService.openSelectValuesDialog(this.values, this.dialogTitle).subscribe(result => {
      this.valuesSelected.emit(result);
    });
  }

}
