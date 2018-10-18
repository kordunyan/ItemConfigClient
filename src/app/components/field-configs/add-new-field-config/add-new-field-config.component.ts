import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FieldConfig} from '../../../shared/domain/field-config';
import {FieldConfigHttpService} from '../../../shared/service/http/field-config-http.service';
import {ProgressBarService} from '../../../shared/service/progress-bar.service';
import {MessageService} from '../../../shared/service/message.service';

@Component({
  selector: 'app-add-new-field-config',
  templateUrl: './add-new-field-config.component.html',
  styleUrls: ['./add-new-field-config.component.css']
})
export class AddNewFieldConfigComponent implements OnInit {

  newFieldConfig: FieldConfig = FieldConfig.default(); 

  constructor(public dialogRef: MatDialogRef<AddNewFieldConfigComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private fieldConfigHttpService: FieldConfigHttpService,
              private progressBarService: ProgressBarService, private messageService: MessageService) {
  }

  ngOnInit() {
  }

  addNewFieldConfig() {
    this.progressBarService.show();
    this.fieldConfigHttpService.save(this.newFieldConfig).subscribe(
      (result) => {
        this.messageService.success('Field config was saved');
        this.progressBarService.hide();
        this.dialogRef.close(this.newFieldConfig);
      },
      (error) => {
        console.error(error);
        this.messageService.error('Failed to save updates');
        this.progressBarService.hide();
      }
    );
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}
