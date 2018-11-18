import {Component, OnInit} from '@angular/core';
import {ExportHttpService} from '../../service/http/export.http.service';
import {MatDialog} from '@angular/material';
import {ProgressBarService} from '../../service/progress-bar.service';
import {FileUtils} from '../../utils/file_utils';
import { DialogService } from '../../service/dialog.service';
import { FieldConfigHttpService } from '../../service/http/field-config-http.service';
import { flatMap } from 'rxjs/operators';
import { FieldConfigExportType, ExprotFieldConfigDto } from '../../dto/export-field-config.dto';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {

  constructor(
    private fieldConfigHttpService: FieldConfigHttpService,
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

  exportFieldsByOwners() {
    this.buildDtoAndExport('getAllOwners', 'Select Owners', FieldConfigExportType.BY_OWNERS);
  }

  exportFieldsByTypes() {
    this.buildDtoAndExport('getAllTypes', 'Select Types', FieldConfigExportType.BY_TYPES);
  }

  exportFieldsByNames() {
    this.buildDtoAndExport('getAllNames', 'Select Names', FieldConfigExportType.BY_NAMES);
  }

  exportAllFields() {
    this.exportFieldConfigs(new ExprotFieldConfigDto(FieldConfigExportType.ALL));  
  }

  buildDtoAndExport(getDataFunction, dialogTitle, exportType: FieldConfigExportType) {
    this.progressBarService.show();
    this.fieldConfigHttpService[getDataFunction]()
      .pipe(
        flatMap((options: any[]) => {
          this.progressBarService.hide();
          return this.dialogService.openOptionsSelectDialog(options, dialogTitle, v => v);
        })
      )
      .subscribe(selectedOptions => {
        this.exportFieldConfigs(new ExprotFieldConfigDto(exportType, selectedOptions));
      }, error => this.progressBarService.hide());
  }

  exportFieldConfigs(dto: ExprotFieldConfigDto) {
    this.progressBarService.show();
    this.exportService.exportFieldConfigs(dto)
      .subscribe(result => {
        console.log(result);
        this.progressBarService.hide();
      }, error => this.progressBarService.hide());
  }
}
