import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-input-field-dialog',
  templateUrl: './input-field-dialog.component.html',
  styleUrls: ['./input-field-dialog.component.css']
})
export class InputFieldDialog {

  fieldName: string;

  constructor(
    public dialogRef: MatDialogRef<InputFieldDialog>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {

  }

  onCancel() {
    this.dialogRef.close();
  }
}
