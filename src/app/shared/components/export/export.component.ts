import { Component, OnInit } from '@angular/core';
import { ExportHttpService } from '../../service/http/export.http.service';
import { MatDialog } from '@angular/material';
import { ItemNumbersSelectDialog } from '../item-numbers-select-dialog/item-numbers-select-dialog';
import { ItemHttpService } from '../../service/http/item-http.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {

  private itemNumbers: string[] = [];

  constructor(
    private exportService: ExportHttpService,
    public dialog: MatDialog,
    private itemService: ItemHttpService,
  ) { }

  ngOnInit() {
    this.itemService.getAllItemValues().subscribe((numbers: string[]) => {
      this.itemNumbers = numbers;
    });
  }

  exportAll() {
    this.exportService.exportAll();
  }

  onExportBy() {
    let dialogRef = this.dialog.open(ItemNumbersSelectDialog, {
      data: {
        itemNumbers: this.itemNumbers
      },
      width: '500px',
    });
  }

}
