import {Component, OnInit} from '@angular/core';
import {ExportHttpService} from '../../service/http/export.http.service';
import {MatDialog} from '@angular/material';
import {ProgressBarService} from '../../service/progress-bar.service';
import {FileUtils} from '../../utils/file_utils';
import { DialogService } from '../../service/dialog.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {

  constructor(
    private progressBarService: ProgressBarService,
    private exportService: ExportHttpService,
    public dialogService: DialogService
  ) { }

  ngOnInit() {
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
    this.dialogService.openItemNumberSelectDialog().subscribe(itemNumbers => {
      this.exportBy(itemNumbers);  
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
