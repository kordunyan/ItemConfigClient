import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {DialogService} from 'src/app/shared/service/dialog.service';

@Component({
  selector: 'app-controll',
  templateUrl: './controll.component.html',
  styleUrls: ['./controll.component.css']
})
export class ControllComponent implements OnInit {

  @Output('add') add = new EventEmitter();
  @Output('reset') reset = new EventEmitter();
  @Output('save') save = new EventEmitter();
  @Output('saveForItemNumber') saveForItemNumber = new EventEmitter<string[]>();
  @Output('delete') delete = new EventEmitter<{}>();
  @Input('valuesToSelect') valuesToSelect: string[] = [];

  constructor(
    private dialogService: DialogService
  ) {
  }

  ngOnInit() {
  }

  onAdd() {
    this.add.emit();
  }

  onSave() {
    this.save.emit();
  }

  onReset() {
    this.reset.emit();
  }

  onSaveForItemNumber() {
    this.saveForItemNumber.emit();
  }

  saveFotItemNumbers() {
    this.dialogService.openItemNumberSelectDialog().subscribe(result => {
      this.saveForItemNumber.emit(result);
    });
  }

  onDelete() {
    this.delete.emit();  
  }

}
