import {Component, OnInit} from '@angular/core';
import {FieldConfigHttpService} from '../../../shared/service/http/field-config-http.service';
import {FieldConfig} from '../../../shared/domain/field-config';
import {ItemFieldConfig} from '../../../shared/domain/item-field-config';
import {ItemFieldConfigManager} from '../../../shared/utils/item-field-config-manager';
import {MultipleEditDialogComponent} from '../../item-field-config/multiple-edit-dialog/multiple-edit-dialog.component';
import {MatDialog} from '@angular/material';
import {AddNewFieldConfigComponent} from '../add-new-field-config/add-new-field-config.component';
import {MessageService} from '../../../shared/service/message.service';
import {ProgressBarService} from '../../../shared/service/progress-bar.service';

@Component({
  selector: 'app-field-configs-list',
  templateUrl: './field-configs-list.component.html',
  styleUrls: ['./field-configs-list.component.css']
})
export class FieldConfigsListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'type', 'owner', 'printable', 'delete'];

  private fieldConfigs: FieldConfig[];
  private fieldConfigsCopy: FieldConfig[];
  fieldConfigsCopyMap = {};

  constructor(private fieldConfigHttpService: FieldConfigHttpService, private messageService: MessageService,
              private progressBarService: ProgressBarService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.progressBarService.show();
    this.fieldConfigHttpService.getAll().subscribe(resultFieldConfigs => {
        this.fieldConfigs = resultFieldConfigs;
        this.createFieldConfigsCopy();
        this.fieldConfigsCopyMap = this.createfieldConfigCopyMap(this.fieldConfigs);
        this.progressBarService.hide();
      },
      (error) => {
        console.error(error);
        this.progressBarService.hide();
      });

  }

  onSaveClick() {
    this.progressBarService.show();
    const fieldConfigs = this.getChangedItemFields();
    this.fieldConfigHttpService.saveAll(fieldConfigs).subscribe(
      (result) => {
        this.createFieldConfigsCopy();
        this.messageService.success('Field configs were saved');
        this.progressBarService.hide();
      },
      (error) => {
        console.error(error);
        this.messageService.error('Failed to save updates');
        this.progressBarService.hide();
      }
    );
  }

  onResetClick() {
    this.copyItemFieldConfigs(this.fieldConfigsCopy, this.fieldConfigs);
    this.messageService.success('Field configs were restored');
  }

  createFieldConfigsCopy() {
    this.fieldConfigsCopy = this.fieldConfigs.map(fieldConfig => FieldConfig.copy(fieldConfig));
  }

  createfieldConfigCopyMap(fieldConfigs: FieldConfig[]) {
    const fieldConfigsCopyMap = {};
    this.fieldConfigs.forEach((fieldConfig: FieldConfig) => {
      fieldConfigsCopyMap[fieldConfig.name] = FieldConfig.copy(fieldConfig);
    });
    return fieldConfigsCopyMap;
  }

  getChangedItemFields(): FieldConfig[] {
    let result: FieldConfig[] = [];
    this.fieldConfigs.forEach((fieldConfig: FieldConfig) => {
      let copiedField = this.fieldConfigsCopyMap[fieldConfig.name];
      if (copiedField == null) {
        result.push(fieldConfig);
      } else if (!FieldConfig.equals(fieldConfig, copiedField)) {
        result.push(fieldConfig);
      }
    });
    return result;
  }

  copyItemFieldConfigs(src: FieldConfig[], dest: FieldConfig[]) {
    dest.length = 0;
    src.forEach(fieldConfig => dest.push(FieldConfig.copy(fieldConfig)));
  }

  openAddNewDialog() {
    this.dialog.open(AddNewFieldConfigComponent, {
      width: '600px'
    }).beforeClose().subscribe((fieldConfig: FieldConfig) => {
      if (fieldConfig) {
        this.fieldConfigs.push(fieldConfig);
        this.createFieldConfigsCopy();
      }
    });
  }

  removeFieldConfig(fieldConfig: FieldConfig) {
    let index = this.fieldConfigs.indexOf(fieldConfig);
    if (index >= 0) {
      this.fieldConfigs.splice(index, 1);
    }
    this.createFieldConfigsCopy();
  }
}
