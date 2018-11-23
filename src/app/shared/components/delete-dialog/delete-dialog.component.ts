import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialog {

  public static readonly OK_STATUS: number = 1;
  public static readonly ALL_STATUS: number = 2;
  public static readonly BY_STATUS: number = 3;

  constructor(
    public dialogRef: MatDialogRef<DeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  onCancel() {
    this.dialogRef.close();
  }

}
