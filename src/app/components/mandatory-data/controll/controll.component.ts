import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DialogService } from 'src/app/shared/service/dialog.service';

@Component({
  selector: 'app-controll',
  templateUrl: './controll.component.html',
  styleUrls: ['./controll.component.css']
})
export class ControllComponent implements OnInit {

  @Output('add') add = new EventEmitter();
  @Output('reset') reset = new EventEmitter();
  @Input('valuesToSelect') valuesToSelect: string[] = [];

  constructor(
    
  ) { }

  ngOnInit() {
  }

  onAdd() {
    this.add.emit();
  }

  onReset() {
    this.reset.emit();
  }

}
