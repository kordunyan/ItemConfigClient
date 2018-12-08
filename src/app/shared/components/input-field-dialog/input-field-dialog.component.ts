import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ArrayUtils } from '../../utils/array-utils';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-field-dialog',
  templateUrl: './input-field-dialog.component.html',
  styleUrls: ['./input-field-dialog.component.css']
})
export class InputFieldDialog {

  fieldName: string;
  existFields: any[];
  fieldExists = false;
  getFieldValueFunction = (f) => f;

  constructor(
    public dialogRef: MatDialogRef<InputFieldDialog>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    if (data && ArrayUtils.isNotEmpty(data.existFields)) {
      this.existFields = data.existFields;
      if (data.getFieldValueFunction) {
        this.getFieldValueFunction = data.getFieldValueFunction;
      }
    }
  }

  inputFieldName() {
    if (ArrayUtils.isNotEmpty(this.existFields)) {
      const foundField =  this.existFields.find(field => this.getFieldValueFunction(field).toLowerCase() === this.fieldName.toLowerCase());
      this.fieldExists = !!foundField;
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
