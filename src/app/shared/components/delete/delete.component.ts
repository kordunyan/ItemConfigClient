import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {DeleteDialog} from '../delete-dialog/delete-dialog.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ItemNumbersSelectDialog } from '../item-numbers-select-dialog/item-numbers-select-dialog';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  public static readonly DELETE_BTN_TYPE_DEFAULT = 'default';
  public static readonly DELETE_BTN_TYPE_DANGER = 'danger';

  @Input('all') all = true;
  @Input('withByItemNumbers') withByItemNumbers = false;
  @Input('btnType') btnType = 'default';
  @Output('onAllChoosen') onAllChoosen = new EventEmitter();
  @Output('onOkChoosen') onOkChoosen = new EventEmitter();
  @Output('onByChoosen') onByChoosen = new EventEmitter<string[]>();

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
        all: this.all,
        withByItemNumbers: this.withByItemNumbers
      },
      width: '300px',
    });

    dialogRef.beforeClose().subscribe(result => {
      if (result === DeleteDialog.OK_STATUS) {
        this.onOkChoosen.emit();
      } else if (result === DeleteDialog.ALL_STATUS) {
        this.onAllChoosen.emit();
      } else if (result === DeleteDialog.BY_STATUS) {
        this.selectItemNumbers();      
      }
    });
  }

  selectItemNumbers() {
    let dialogRef = this.dialog.open(ItemNumbersSelectDialog, {
      width: '500px',
    });

    dialogRef.beforeClose().subscribe(result => {
      if (result && result.length > 0) {
        this.onByChoosen.emit(result);
      }
    });
  }
}
