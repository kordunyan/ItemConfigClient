import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DeleteDialog } from '../delete-dialog/delete-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  @Input('all') all: boolean = true;
  @Output('onAllChoosen') onAllChoosen = new EventEmitter();
  @Output('onOkChoosen') onOkChoosen = new EventEmitter();

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  onBtnClick() {
    let dialogRef = this.dialog.open(DeleteDialog, {
      data: {
        all: this.all
      },
      width: '300px',
   });

   dialogRef.afterClosed().subscribe(result => {
      if (result === DeleteDialog.OK_STATUS) {
        this.onOkChoosen.emit();  
      } else if (result === DeleteDialog.ALL_STATUS) {
        this.onAllChoosen.emit();
      }
   });
  }
}
