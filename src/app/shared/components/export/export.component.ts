import {Component, OnInit} from '@angular/core';
import {ExportHttpService} from '../../service/http/export.http.service';
import {MatDialog} from '@angular/material';
import {ItemNumbersSelectDialog} from '../item-numbers-select-dialog/item-numbers-select-dialog';
import {ItemHttpService} from '../../service/http/item-http.service';
import {ProgressBarService} from '../../service/progress-bar.service';
import {FileUtils} from '../../utils/file_utils';

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
    private progressBarService: ProgressBarService
  ) {
  }

  ngOnInit() {
    this.itemService.getAllItemValues().subscribe((numbers: string[]) => {
      this.itemNumbers = numbers;
    });
  }

  exportAll() {
    this.progressBarService.show();
    this.exportService.exportAll().subscribe(
      (result) => {
        this.progressBarService.hide();
        FileUtils.blobToDownload(result.fileData, result.fileName);
      }, (error) => {
        this.progressBarService.hide();
      });
  }

  onExportBy() {
    let dialogRef = this.dialog.open(ItemNumbersSelectDialog, {
      data: {
        itemNumbers: this.itemNumbers
      },
      width: '500px',
    });

    dialogRef.beforeClose().subscribe(result => {
      if (result && result.length > 0) {
        this.exportBy(result);
      }
    });
  }

  exportBy(itemNumbers: string[]) {
    this.progressBarService.show();
    this.exportService.exportByItemNumbers(itemNumbers).subscribe(
      (result) => {
        this.progressBarService.hide();
        FileUtils.blobToDownload(result.fileData, result.fileName);
      },
      (error) => {
        this.progressBarService.hide();
      }
    );
  }

}
