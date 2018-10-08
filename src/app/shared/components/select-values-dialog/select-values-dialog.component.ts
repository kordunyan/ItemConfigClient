import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-select-values-dialog',
  templateUrl: './select-values-dialog.component.html',
  styleUrls: ['./select-values-dialog.component.css']
})
export class SelectValuesDialogComponent {
  valuesFormControl = new FormControl();
  allValues: string[] = [];
  title = 'Choose Fields';

  constructor(
    public dialogRef: MatDialogRef<SelectValuesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.allValues = data.allValues;
    if (data.title) {
      this.title = data.title;
    }
  }

  onClose() {
    this.dialogRef.close();
  }

}
