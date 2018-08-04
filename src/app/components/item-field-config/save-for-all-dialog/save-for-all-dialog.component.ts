import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-save-for-all-dialog',
  templateUrl: './save-for-all-dialog.component.html',
  styleUrls: ['./save-for-all-dialog.component.css']
})
export class SaveForAllDialogComponent {

  public static readonly ONLY_FOR_NEW = 'ONLY_FOR_NEW';
  public static readonly OVERRIDE_CHANGED = 'OVERRIDE_CHANGED';

  saveStrategy: string;

  constructor(
    public dialogRef: MatDialogRef<SaveForAllDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.saveStrategy = this.getOverideChangeOptionValue();
  }

  onCancel() {
    this.dialogRef.close(); 
  }

  getOnlyForNewOptionValue(): string {
    return SaveForAllDialogComponent.ONLY_FOR_NEW;
  }

  getOverideChangeOptionValue(): string {
    return SaveForAllDialogComponent.OVERRIDE_CHANGED; 
  }

}
