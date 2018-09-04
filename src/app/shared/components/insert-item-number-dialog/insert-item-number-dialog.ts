import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-insert-item-number-dialog',
  templateUrl: './insert-item-number-dialog.html',
  styleUrls: ['./insert-item-number-dialog.css']
})
export class InsertItemNumberDialog implements OnInit {

  private separator = ',';
  private itemNumbersInput = '';

  constructor(
    public dialogRef: MatDialogRef<InsertItemNumberDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  okClick() {
    let clearedItemNumbers = this.getClearedInput(this.itemNumbersInput);
    let clearedSeparator = this.getClearedInput(this.separator);
    this.dialogRef.close(clearedItemNumbers.split(clearedSeparator));
  }

  private getClearedInput(value: string) {
    return value.replace(/\s/g, '');
  }

}
