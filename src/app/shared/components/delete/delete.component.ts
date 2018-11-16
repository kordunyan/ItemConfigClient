import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {DeleteDialog} from '../delete-dialog/delete-dialog.component';
import {DialogService} from '../../service/dialog.service';

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
  @Input('small') small = false;
  @Output('onAllChoosen') onAllChoosen = new EventEmitter();
  @Output('onOkChoosen') onOkChoosen = new EventEmitter();
  @Output('onByChoosen') onByChoosen = new EventEmitter<string[]>();

  constructor(
    public dialogService: DialogService
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
    this.dialogService.openDeleteDialog(this.all, this.withByItemNumbers).subscribe(result => {
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
    this.dialogService.openItemNumberSelectDialog().subscribe(result => this.onByChoosen.emit(result));
  }
}
