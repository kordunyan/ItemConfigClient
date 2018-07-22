import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-save-for-all-dialog',
  templateUrl: './save-for-all-dialog.component.html',
  styleUrls: ['./save-for-all-dialog.component.css']
})
export class SaveForAllDialogComponent {

  saveStrategy: string;

  constructor(
    public dialogRef: MatDialogRef<SaveForAllDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
  }

  onCancel() {
    this.dialogRef.close(); 
  }

}
