import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InsertItemNumberDialog } from '../insert-item-number-dialog/insert-item-number-dialog';
import {ItemHttpService} from '../../service/http/item-http.service';

@Component({
  selector: 'app-item-numbers-select-dialog',
  templateUrl: './item-numbers-select-dialog.html',
  styleUrls: ['./item-numbers-select-dialog.css']
})
export class ItemNumbersSelectDialog implements OnInit {
  private itemNumbersMap = {};
  private itemNumbers: string[] = [];
  private selectedItemNumbers: string[] = [];

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ItemNumbersSelectDialog>,
    private itemService: ItemHttpService,
      @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.itemService.getAllItemValues().subscribe((numbers: string[]) => {
      this.itemNumbers = numbers;
      this.createItemNumbersMap();
    });
  }

  createItemNumbersMap() {
    this.itemNumbers.forEach(itemNumber => {
      this.itemNumbersMap[itemNumber] = itemNumber;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClear() {
    this.selectedItemNumbers = [];
  }

  okClick() {
    this.dialogRef.close(this.selectedItemNumbers);
  }

  openInsertItem() {
    let dialogRef = this.dialog.open(InsertItemNumberDialog, {
      width: '400px',
    });

    dialogRef.beforeClose().subscribe(result => {
      if (result) {
        let newItemNumbers = [];
        result.forEach(itemNumber => {
          if (this.itemNumbersMap[itemNumber]) {
            newItemNumbers.push(itemNumber);
          }
        });
        this.updateSelectedItems(newItemNumbers);
      }
   });
  }

  private updateSelectedItems(newItemNumbers: string[]) {
    let updatedItemNumbers = this.selectedItemNumbers.slice();
    newItemNumbers.forEach(newItemNumber => {
      if (updatedItemNumbers.indexOf(newItemNumber) === -1) {
        updatedItemNumbers.push(newItemNumber);
      }
    });
    this.selectedItemNumbers = updatedItemNumbers;
  }

}
