import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ItemFieldConfig} from '../../../shared/domain/item-field-config';
import {FieldConfig} from '../../../shared/domain/field-config';
import {FieldConfigHttpService} from '../../../shared/service/http/field-config-http.service';
import {MessageService} from '../../../shared/service/message.service';
import {ProgressBarService} from '../../../shared/service/progress-bar.service';

@Component({
  selector: '[app-field-config-row]',
  templateUrl: './field-config-row.component.html',
  styleUrls: ['./field-config-row.component.css']
})
export class FieldConfigRowComponent implements OnInit {

  @Input('fieldConfig') fieldConfig: FieldConfig;
  @Output('onOkChoosen') removedFieldConfig = new EventEmitter();

  constructor(private fieldConfigHttpService: FieldConfigHttpService, private messageService: MessageService,
              private progressBarService: ProgressBarService) { }

  ngOnInit() {
  }

  onDeleteFieldConfig() {
    this.progressBarService.show();
    this.fieldConfigHttpService.delete(this.fieldConfig).subscribe(
      (result) => {
        this.messageService.success('Field config was deleted');
        this.removedFieldConfig.emit(this.fieldConfig);
        this.progressBarService.hide();
      },
      (error) => {
        this.messageService.error('Failed to delete current Field Config');
        this.progressBarService.hide();
      }
    );
  }
}
