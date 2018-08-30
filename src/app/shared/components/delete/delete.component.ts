import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {DeleteDialog} from '../delete-dialog/delete-dialog.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  public static readonly DELETE_BTN_TYPE_DEFAULT = 'default';
  public static readonly DELETE_BTN_TYPE_DANGER = 'danger';

  @Input('all') all = true;
  @Input('btnType') btnType = 'default';
  @Output('onAllChoosen') onAllChoosen = new EventEmitter();
  @Output('onOkChoosen') onOkChoosen = new EventEmitter();

  constructor(
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
  }

  getDangerBtnType() {
    return DeleteComponent.DELETE_BTN_TYPE_DANGER;
  }

  getDefaultBtnType() {
    return DeleteComponent.DELETE_BTN_TYPE_DEFAULT;
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
