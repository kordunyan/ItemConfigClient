import {Component, Input, OnInit} from '@angular/core';
import {ExportHttpService} from '../../service/http/export.http.service';
import {ProgressBarService} from '../../service/progress-bar.service';
import {FileUtils} from '../../utils/file_utils';

@Component({
  selector: 'app-export-item-number',
  templateUrl: './export-item-number.component.html',
  styleUrls: ['./export-item-number.component.css']
})
export class ExportItemNumberComponent implements OnInit {

  @Input('itemNumber') itemNumber: string;

  constructor(
    private exportService: ExportHttpService,
    private progressBarService: ProgressBarService
  ) {
  }

  ngOnInit() {
  }

  export() {
    this.progressBarService.show();
    this.exportService.exportByItemNumbers([this.itemNumber])
      .subscribe((result) => {
        this.progressBarService.hide();
        FileUtils.blobToDownload(result.fileData, result.fileName);
      }, (error) => {
        this.progressBarService.hide();
      });
  }

}
