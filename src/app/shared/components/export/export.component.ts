import {Component, OnInit} from '@angular/core';
import {ExportHttpService} from '../../service/http/export.http.service';
import {ProgressBarService} from '../../service/progress-bar.service';
import {FileUtils} from '../../utils/file_utils';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {

  constructor(
    private exportService: ExportHttpService,
    private progressBarService: ProgressBarService
  ) {
  }

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

  exportBy() {
    let itemNumbers = ['045938-B', '045938-W'];
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
