import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Item } from 'src/app/shared/domain/item';
import { MultipleField } from 'src/app/shared/domain/multiple-field';
import { DialogService } from 'src/app/shared/service/dialog.service';
import { OptionsSelectDialog } from 'src/app/shared/components/options-select-dialog/options-select-dialog';
import { Field } from 'src/app/shared/domain/field';
import { filter } from 'rxjs/operators';
import { ArrayUtils } from 'src/app/shared/utils/array-utils';

@Component({
  selector: 'app-save-for-all-dialog',
  templateUrl: './save-for-all-dialog.component.html',
  styleUrls: ['./save-for-all-dialog.component.css']
})
export class SaveForAllDialogComponent {

  public static readonly ONLY_FOR_NEW = 'ONLY_FOR_NEW';
  public static readonly OVERRIDE_CHANGED = 'OVERRIDE_CHANGED';

  saveStrategy: string;
  item: Item;
  multipleFields: MultipleField[] = [];
  selectedFieldsMap = {};
  fieldsToSelect: Field[] = [];

  constructor(
    private dialogRef: MatDialogRef<SaveForAllDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialog: MatDialog
  ) { 
    this.saveStrategy = this.getOverideChangeOptionValue();
    this.item = data.item;
    this.fieldsToSelect = this.item.fields;
  }

  onCancel() {
    this.dialogRef.close(); 
  }

  getOnlyForNewOptionValue(): string {
    return SaveForAllDialogComponent.ONLY_FOR_NEW;
  }

  getOverideChangeOptionValue(): string {
    return SaveForAllDialogComponent.OVERRIDE_CHANGED; 
  }

  addField() {

    this.dialog.open(OptionsSelectDialog, {
      width: '500px',
      data: {
        options: this.fieldsToSelect,
        title: 'Select Item Fields',
        getFieldValueFunction: (field: Field) => field.fieldConfigName
      }
    }).beforeClose()
    .pipe(
      filter(result => ArrayUtils.isNotEmpty(result))
    ).subscribe((selectedFields: Field[]) => {
      this.addMultipleField(selectedFields); 
      this.addToSelectedFieldsMap(selectedFields);
      this.fieldsToSelect = this.getNonSelectedFields();
    });
  }

  private getNonSelectedFields(): Field[] {
    return this.item.fields.filter(field => !this.selectedFieldsMap[field.fieldConfigName]);
  }

  private addToSelectedFieldsMap(fields: Field[]) {
    fields.forEach(field => this.selectedFieldsMap[field.fieldConfigName] = field);
  }

  private addMultipleField(fields: Field[]) {
    fields.map(field => MultipleField.createFromField(field))
      .forEach(multipleField => this.multipleFields.push(multipleField));
  }

}
