import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {DialogService} from 'src/app/shared/service/dialog.service';
import {Item} from '../../domain/item';

@Component({
  selector: 'app-controll',
  templateUrl: './controll.component.html',
  styleUrls: ['./controll.component.css']
})
export class ControllComponent implements OnInit {

  @Input('withReset') withReset = true;
  @Input('withDelete') withDelete = true;
  @Input('item') item: Item;
  @Input('small') small = false;
  @Input('withSaveStrategy') withSaveStrategy = true;
  @Input('disabled') disabled = false; 

  @Output('add') add = new EventEmitter();
  @Output('reset') reset = new EventEmitter();
  @Output('save') save = new EventEmitter();
  @Output('saveForItemNumber') saveForItemNumber = new EventEmitter<any>();
  @Output('delete') delete = new EventEmitter<any>();

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
    this.saveWithFieldsCriteria();  
  }

  saveFotItemNumbers() {
    this.dialogService.openItemNumberSelectDialog().subscribe(itemNumbers => { 
      this.saveWithFieldsCriteria(itemNumbers);
    });
  }

  saveWithFieldsCriteria(itemNumbers?: string[]) {
    this.dialogService.openSaveForAllConfigurationDialog(this.item, this.withSaveStrategy)
      .subscribe(fieldsCriteria => {
        this.saveForItemNumber.emit({
          fieldsCriteria: fieldsCriteria,
          itemNumbers: itemNumbers
        });
      })
  }

  onDelete() {
    this.delete.emit();
  }

  onDeleteCurrent() {
    if (this.item) {
      this.dialogService.openSaveForAllConfigurationDialog(this.item, false)
        .subscribe(fieldsCriteria => {
          this.delete.emit({
            deleteForAll: true,
            fieldsCriteria: fieldsCriteria
          });
        });
    } else {
      this.delete.emit({deleteForAll: true});
    }
  }

  onDeleteByNumbers(itemNumbers: string[]) {
    if (this.item) {
      this.dialogService.openSaveForAllConfigurationDialog(this.item, false)
        .subscribe(fieldsCriteria => {
          this.delete.emit({
            deleteForAll: true,
            itemNumbers: itemNumbers,
            fieldsCriteria: fieldsCriteria
          });
        });
    } else {
      this.delete.emit({
        deleteForAll: true,
        itemNumbers: itemNumbers
      });
    }
  }

}
