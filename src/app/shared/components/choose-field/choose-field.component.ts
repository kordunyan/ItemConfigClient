import {Component, OnInit, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl} from '@angular/forms';
import {FieldConfig} from '../../../shared/domain/field-config';


@Component({
  selector: 'choose-field-dialog',
  templateUrl: './choose-field-dialog.html',
  styleUrls: ['./choose-field-dialog.css']
})
export class ChooseFieldDialog {
  fieldConfigs = new FormControl();
  fieldConfigList: FieldConfig[] = [];

  constructor(
    public dialogRef: MatDialogRef<ChooseFieldDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.fieldConfigList = data.fieldConfigs;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
