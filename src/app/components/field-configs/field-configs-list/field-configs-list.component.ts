import {Component, OnInit} from '@angular/core';
import {FieldConfigHttpService} from '../../../shared/service/http/field-config-http.service';
import {FieldConfig} from '../../../shared/domain/field-config';
import {ItemFieldConfig} from '../../../shared/domain/item-field-config';
import {ItemFieldConfigManager} from '../../../shared/utils/item-field-config-manager';
import {MultipleEditDialogComponent} from '../../item-field-config/multiple-edit-dialog/multiple-edit-dialog.component';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {AddNewFieldConfigComponent} from '../add-new-field-config/add-new-field-config.component';
import {MessageService} from '../../../shared/service/message.service';
import {ProgressBarService} from '../../../shared/service/progress-bar.service';
import {ArrayUtils} from 'src/app/shared/utils/array-utils';

@Component({
  selector: 'app-field-configs-list',
  templateUrl: './field-configs-list.component.html',
  styleUrls: ['./field-configs-list.component.css']
})
export class FieldConfigsListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'type', 'owner', 'printable', 'delete'];
  filterValue: string;
  private fieldConfigs: FieldConfig[];
  private fieldConfigsCopy: FieldConfig[];
  fieldConfigsCopyMap = {};
  dataSource;

  constructor(private fieldConfigHttpService: FieldConfigHttpService,
              private messageService: MessageService,
              private progressBarService: ProgressBarService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.progressBarService.show();
    this.fieldConfigHttpService.getAll().subscribe(resultFieldConfigs => {
        this.fieldConfigs = resultFieldConfigs;
        this.initDatasource();
        this.createFieldConfigsCopy();
        this.fieldConfigsCopyMap = this.createfieldConfigCopyMap(this.fieldConfigs);
        this.progressBarService.hide();
      },
      (error) => {
        console.error(error);
        this.progressBarService.hide();
      });
  }

  initDatasource() {
    this.dataSource = new MatTableDataSource(this.fieldConfigs);
    this.dataSource.filterPredicate = (data, filter) => {
      return data.name.toLowerCase().indexOf(filter) >= 0;
    };
    if (this.filterValue) {
      this.filterFieldConfigs();
    }
  }

  filterFieldConfigs() {
    this.dataSource.filter = this.filterValue.trim().toLocaleLowerCase();
  }


  onSaveClick() {
    const fieldConfigs = this.getChangedItemFields();
    if (fieldConfigs.length <= 0) {
      return;
    }
    this.progressBarService.show();
    this.fieldConfigHttpService.saveAll(fieldConfigs).subscribe(
      (result) => {
        this.createFieldConfigsCopy();
        this.messageService.success('Field configs were saved');
        this.progressBarService.hide();
      },
      (error) => {
        console.error(error);
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
        this.sortFieldConfigs();
        this.initDatasource();
        this.createFieldConfigsCopy();
      }
    });
  }

  onDeleteFieldConfig(fieldConfig: FieldConfig) {
    this.progressBarService.show();
    this.fieldConfigHttpService.delete(fieldConfig).subscribe(
      (result) => {
        this.messageService.success('Field config was deleted');
        this.removeFieldConfig(fieldConfig);
        this.progressBarService.hide();
      },
      (error) => {
        this.progressBarService.hide();
      }
    );
  }

  sortFieldConfigs() {
    ArrayUtils.sort(this.fieldConfigs, (field) => field.name.toLowerCase());
  }

  removeFieldConfig(fieldConfig: FieldConfig) {
    ArrayUtils.remove(this.fieldConfigs, fieldConfig);
    ArrayUtils.remove(this.fieldConfigsCopy, fieldConfig);
    this.initDatasource();
  }
}
