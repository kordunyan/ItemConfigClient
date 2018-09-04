import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FieldConfig } from '../../../shared/domain/field-config';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ChooseFieldDialog } from '../choose-field/choose-field.component';

@Component({
  selector: 'app-excluded-fields',
  templateUrl: './excluded-fields.component.html',
  styleUrls: ['./excluded-fields.component.css']
})
export class ExcludedFieldsComponent implements OnInit {

  @Input('fieldConfigs') fieldConfigs: FieldConfig[] = [];
  @Output('onChoseFields') onChooseFields = new EventEmitter<FieldConfig[]>();

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  openChooseFieldDialog() {
    let dialogRef = this.dialog.open(ChooseFieldDialog, {
      data: {
        fieldConfigs: this.fieldConfigs
      },
      width: '450px',
   });

   dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onChooseFields.emit(result);  
      }
   });
 }
}
