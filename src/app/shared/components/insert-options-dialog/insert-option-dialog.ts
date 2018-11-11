import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-insert-item-number-dialog',
  templateUrl: './insert-option-dialog.html',
  styleUrls: ['./insert-option-dialog.css']
})
export class InsertOptionDialog implements OnInit {

  public separator = ',';
  public optionsInput = '';

  constructor(
    public dialogRef: MatDialogRef<InsertOptionDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  okClick() {
    let clearedItemNumbers = this.getClearedInput(this.optionsInput);
    let clearedSeparator = this.getClearedInput(this.separator);
    this.dialogRef.close(clearedItemNumbers.split(clearedSeparator));
  }

  private getClearedInput(value: string) {
    return value.replace(/\s/g, '');
  }

}
