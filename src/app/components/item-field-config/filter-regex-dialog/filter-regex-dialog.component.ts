import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {ItemFieldConfig} from '../../../shared/domain/item-field-config';
import {SearchByRegexField} from '../../../shared/domain/search-by-regex-field';
import {OwnedSearchByRegexField} from '../../../shared/domain/owned-search-by-regex-field';
import {ArrayUtils} from '../../../shared/utils/array-utils';
import {DialogService} from '../../../shared/service/dialog.service';
import {OptionsSelectDialog} from '../../../shared/components/options-select-dialog/options-select-dialog';
import {filter} from 'rxjs/operators';
import { InputFieldDialog } from 'src/app/shared/components/input-field-dialog/input-field-dialog.component';


@Component({
  selector: 'app-filter-regex-dialog',
  templateUrl: './filter-regex-dialog.component.html',
  styleUrls: ['./filter-regex-dialog.component.css']
})
export class FilterRegexDialogComponent {

  private static readonly EMPTY = '';

  itemFieldConfig: ItemFieldConfig;
  instructionFieldsMap = {};
  instructionFields: string[];
  isJsonMode = false;
  searchByRegexFields: SearchByRegexField[] = [];
  ownedSearchByRegexFields: OwnedSearchByRegexField[] = [];
  textRegex: string;
  buildForTextMode = false;
  invalidRegexMessage: string;

  constructor(
    public dialogRef: MatDialogRef<FilterRegexDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    public dialog: MatDialog,
  ) {
    this.itemFieldConfig = data.itemFieldConfig;
    this.instructionFields = ArrayUtils.isEmpty(data.instructionFields) ? [] : data.instructionFields.slice();
    this.textRegex = this.itemFieldConfig.filterRegex;
    this.createInstructionFieldsMap();
    this.initMode();
    this.addDefaultSearchByRegexField();
  }

  createInstructionFieldsMap() {
    this.instructionFields.forEach(fieldName => this.instructionFieldsMap[fieldName] = fieldName);
  }

  initMode() {
    if (this.isEmptyFilterRegex()) {
      this.buildForTextMode = true;
      this.setJsonMode();
      return;
    }
    const parsedRegexFields = this.parseToSearchByRegexFields();
    if (ArrayUtils.isNotEmpty(parsedRegexFields)) {
      this.ownedSearchByRegexFields = parsedRegexFields;
      this.deleteSelectedInstructionFields(parsedRegexFields.map(regexField => regexField.fieldName));
      this.buildForTextMode = true;
      this.setJsonMode();
    } else {
      this.setTextMode();
    }
  }

  parseToSearchByRegexFields(): OwnedSearchByRegexField[] {
    try {
      const object = JSON.parse(this.textRegex);
      if (ArrayUtils.isNotEmpty(object.searchByRegexFields)) {
        return this.buildOwnedSearchByRegexFields(object.searchByRegexFields);
      }
      this.invalidRegexMessage = 'missing [searchByRegexFields] object';
      return null;
    } catch (e) {
      this.invalidRegexMessage = e;
      return null;
    }
  }

  isEmptyFilterRegex(): boolean {
    return this.textRegex == undefined || this.textRegex.length === 0;
  }

  addInstructionFields() {
    this.dialog.open(OptionsSelectDialog, {
      width: '500px',
      data: {
        options: this.instructionFields,
        title: 'Select Instruction Fields',
        getFieldValueFunction: (v) => v
      }
    }).beforeClose()
      .pipe(
        filter(result => ArrayUtils.isNotEmpty(result))
      )
      .subscribe(selectedFields => {
        this.addNewSearchByRegexFields(selectedFields);
      });
  }

  addField() {
    this.dialog.open(InputFieldDialog, {
      width: '400px',
      data: {
        existFields: this.ownedSearchByRegexFields,
        getFieldValueFunction: field => field.fieldName
      }
    }).beforeClose()
    .pipe(
      filter(result => result != undefined)
    )
    .subscribe(newFieldName => {
      this.addNewSearchByRegexFields([newFieldName]);  
    });
  }

  addDefaultSearchByRegexField() {
    if (this.instructionFields.length === 1 && this.getValidOwnedSearchByRegexFields().length === 0) {
      this.addNewSearchByRegexFields(this.instructionFields);
    }
  }

  getValidOwnedSearchByRegexFields() {
    return this.ownedSearchByRegexFields.filter(field => !field.invalidOwner);
  }

  initJsonMode() {
    this.deleteSelectedInstructionFields(this.searchByRegexFields.map(field => field.fieldName));
  }

  onDelete(deletedSearchByRegexField: OwnedSearchByRegexField) {
    const index = this.ownedSearchByRegexFields.findIndex(searchByRegexField => {
      return searchByRegexField.fieldName === deletedSearchByRegexField.fieldName;
    });
    if (index > -1) {
      if (!deletedSearchByRegexField.invalidOwner) {
        this.instructionFields.push(deletedSearchByRegexField.fieldName);
      }
      this.ownedSearchByRegexFields.splice(index, 1);
    }
  }

  applyRegex() {
    if (this.isJsonMode) {
      this.itemFieldConfig.filterRegex = this.buildJsonFilterRegex();
    } else {
      this.itemFieldConfig.filterRegex = this.textRegex;
    }
    this.dialogRef.close(true);
  }

  buildJsonFilterRegex(pretty = false): string {
    const noEmptySearchByRegexFields = this.getNoEmptySearchByRegexFields();
    if (noEmptySearchByRegexFields.length > 0) {
      const rsultObject = {
        searchByRegexFields: noEmptySearchByRegexFields
      };
      return JSON.stringify(rsultObject, null, pretty ? 2 : 0);
    }
    return FilterRegexDialogComponent.EMPTY;
  }

  getNoEmptySearchByRegexFields() {
    return this.ownedSearchByRegexFields.filter(searchByRegexField => {
      return searchByRegexField.regex && searchByRegexField.regex.length > 0;
    }).map(searchByRegexField => SearchByRegexField.copy(searchByRegexField));
  }

  addNewSearchByRegexFields(fields: string[]) {
    this.createNewSearchByRegexFields(fields).forEach(searchByRegexField => {
      this.ownedSearchByRegexFields.push(searchByRegexField);
    });
    this.deleteSelectedInstructionFields(fields);
  }

  deleteSelectedInstructionFields(selectedFields: string[]) {
    selectedFields.forEach(selectedField => {
      const index = this.instructionFields.indexOf(selectedField);
      if (index > -1) {
        this.instructionFields.splice(index, 1);
      }
    });
  }

  buildOwnedSearchByRegexFields(searchByRegexFields: SearchByRegexField[]): OwnedSearchByRegexField[] {
    return searchByRegexFields.map(searchByRegexField => {
      return new OwnedSearchByRegexField(
        searchByRegexField.fieldName,
        searchByRegexField.regex,
        this.isValidOwner(searchByRegexField.fieldName)
      );
    });
  }

  createNewSearchByRegexFields(fields: string[]) {
    return fields.map(field => new OwnedSearchByRegexField(field, '', this.isValidOwner(field)));
  }

  isValidOwner(fieldName): boolean {
    return this.instructionFieldsMap[fieldName] == undefined;
  }

  onCancel() {
    this.dialogRef.close();
  }

  setTextMode() {
    if (this.buildForTextMode) {
      this.textRegex = this.buildJsonFilterRegex(true);
    }
    this.isJsonMode = false;
  }

  setJsonMode() {
    this.isJsonMode = true;
  }

}
