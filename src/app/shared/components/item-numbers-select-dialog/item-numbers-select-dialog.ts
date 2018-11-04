import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatCheckboxChange } from '@angular/material';
import { InsertItemNumberDialog } from '../insert-item-number-dialog/insert-item-number-dialog';
import {ItemHttpService} from '../../service/http/item-http.service';
import {FormControl} from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DocumentUtils } from '../../utils/document-utils';
import { MessageService } from '../../service/message.service';

@Component({
  selector: 'app-item-numbers-select-dialog',
  templateUrl: './item-numbers-select-dialog.html',
  styleUrls: ['./item-numbers-select-dialog.css']
})
export class ItemNumbersSelectDialog {
  
  itemNumberInput = new FormControl();
  public filteredItemNumbers: SelectableItemNumber[];
  public itemNumbersMap = {};
  public allItemNumbersSelected = false;
  public itemNumbersForSelect: SelectableItemNumber[] = [];
  public isLoaded = false;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ItemNumbersSelectDialog>,
    private itemService: ItemHttpService,
    private messageService: MessageService,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.itemService.getAllItemValues().subscribe((numbers: string[]) => {
      this.createItemNumbersForSelect(numbers);
      this.createItemNumbersMap();
      this.initFilter();
      this.isLoaded = true;
    });
  }

  createItemNumbersForSelect(itemNumbes: string[]) {
    this.itemNumbersForSelect = itemNumbes.map(itemNumber => {
      return new SelectableItemNumber(itemNumber);
    });
  }

  initFilter() {
    this.itemNumberInput.valueChanges.pipe(
      startWith<string>(''),
      map((itemNumber: string) => {
        return itemNumber ? this._filter(itemNumber) : this.itemNumbersForSelect;
      })
    ).subscribe(result => {
      this.filteredItemNumbers = result;
      this.updateSelectedAll();
    });
  }

  private _filter(itemNumberFilter: string): SelectableItemNumber[] {
    const inLowerCase = itemNumberFilter.trim().toLowerCase();
    return this.itemNumbersForSelect.filter(item => item.itemNumber.toLowerCase().indexOf(inLowerCase) > -1);
  }

  select(item: SelectableItemNumber) {
    item.selected = !item.selected;
    this.updateSelectedAll();
  }

  updateSelectedAll() {
    this.allItemNumbersSelected = this.getSelectedItems().length === this.filteredItemNumbers.length;  
  }

  selectDeselectAll(change: MatCheckboxChange) {
    this.filteredItemNumbers.forEach(item => item.selected = this.allItemNumbersSelected);
  }

  createItemNumbersMap() {
    this.itemNumbersForSelect.forEach(item => {
      this.itemNumbersMap[item.itemNumber] = item;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getSelectedItems(): string[] {
    return this.filteredItemNumbers
        .filter(item => item.selected)
        .map(item => item.itemNumber);
  }

  okClick() {
    this.dialogRef.close(this.getSelectedItems());
  }

  copyToBuffer() {
    const text = this.itemNumbersForSelect.map(item => item.itemNumber).join(",\n"); 
    if (DocumentUtils.clipboard(text)) {
      this.messageService.info('Item numbers were copied to bufer');
    }
  }

  openInsertItem() {
    let dialogRef = this.dialog.open(InsertItemNumberDialog, {
      width: '400px',
    });

    dialogRef.beforeClose().subscribe(result => {
      if (result) {
        result.forEach(itemNumber => {
          this.itemNumbersMap[itemNumber].selected = true;  
        });
        this.updateSelectedAll();
      }
   });
  }
}

class SelectableItemNumber {
  constructor(
    public itemNumber: string,
    public selected: boolean = false
  ) {}
}
