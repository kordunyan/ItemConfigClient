import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ItemFieldConfig} from '../../../shared/domain/item-field-config';
import {FieldConfig} from '../../../shared/domain/field-config';
import {FieldConfigHttpService} from '../../../shared/service/http/field-config-http.service';
import {MessageService} from '../../../shared/service/message.service';

@Component({
  selector: '[app-field-config-row]',
  templateUrl: './field-config-row.component.html',
  styleUrls: ['./field-config-row.component.css']
})
export class FieldConfigRowComponent implements OnInit {

  @Input('fieldConfig') fieldConfig: FieldConfig;
  @Output('onOkChoosen') onOkChoosen = new EventEmitter();

  constructor(private fieldConfigHttpService: FieldConfigHttpService, private messageService: MessageService) { }

  ngOnInit() {
  }

  onDeleteFieldConfig() {
    this.fieldConfigHttpService.delete(this.fieldConfig).subscribe(
      (result) => {
        this.messageService.success('Field config was deleted');
        this.onOkChoosen.emit(this.fieldConfig);
      },
      (error) => {
        console.error(error);
        this.messageService.error('Failed to delete current Field Config');
      }
    );
  }
}
