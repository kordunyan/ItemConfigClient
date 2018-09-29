import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent} from '@angular/material';
import {ItemFieldConfig} from '../../../shared/domain/item-field-config';
import {SearchByRegexField} from '../../../shared/domain/search-by-regex-field';
import {DialogService} from '../../../shared/service/dialog.service';
import {ItemHttpService} from '../../../shared/service/http/item-http.service';
import { OwnedSearchByRegexField } from '../../../shared/domain/owned-search-by-regex-field';


@Component({
  selector: 'app-filter-regex-dialog',
  templateUrl: './filter-regex-dialog.component.html',
  styleUrls: ['./filter-regex-dialog.component.css']
})
export class FilterRegexDialogComponent {

  private static readonly EMPTY = '';

  itemFieldConfig: ItemFieldConfig;
  instructionFields: string[];
  isJsonMode = false;
  searchByRegexFields: SearchByRegexField[] = [];
  ownedSearchByRegexFields: OwnedSearchByRegexField[] = [];
  textRegex: string;

  constructor(
    public dialogRef: MatDialogRef<FilterRegexDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.itemFieldConfig = data.itemFieldConfig;
    this.instructionFields = data.instructionFields.slice();
    this.initMode();
    if (this.isJsonMode) {
      this.initJsonMode();
    }
    this.addDefaultSearchByRegexField();
    
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

  buildOwnedSearchByRegexFields() {
    this.ownedSearchByRegexFields = this.searchByRegexFields.map(searchByRegexField => {
      return new OwnedSearchByRegexField(
        searchByRegexField.fieldName,
        searchByRegexField.regex,
        this.instructionFields.indexOf(searchByRegexField.fieldName) < 0  
      );
    });
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
    this.dialogRef.close();
  }

  buildJsonFilterRegex(): string {
    const noEmptySearchByRegexFields = this.getNoEmptySearchByRegexFields();
    if (noEmptySearchByRegexFields.length > 0) {
      const rsultObject = {
        searchByRegexFields: noEmptySearchByRegexFields
      };
      return JSON.stringify(rsultObject);
    }
    return FilterRegexDialogComponent.EMPTY;
  }

  getNoEmptySearchByRegexFields() {
    return this.ownedSearchByRegexFields.filter(searchByRegexField => {
      return searchByRegexField.regex && searchByRegexField.regex.length > 0;
    }).map(searchByRegexField => SearchByRegexField.copy(searchByRegexField));
  }

  initMode() {
    this.textRegex = this.itemFieldConfig.filterRegex;
    if (this.itemFieldConfig.filterRegex === null || this.itemFieldConfig.filterRegex.length === 0) {
      this.setIsJsonMode(true);
      return;
    }
    try {
      const object = JSON.parse(this.itemFieldConfig.filterRegex);
      if (object.searchByRegexFields) {
        this.searchByRegexFields = object.searchByRegexFields;
        if (this.searchByRegexFields.length > 0) {
          this.buildOwnedSearchByRegexFields();
        }
        this.setIsJsonMode(true);
      } else {
        this.setIsJsonMode(false);
      }
    } catch (e) {
      this.setIsJsonMode(false);
    }
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

  createNewSearchByRegexFields(fields: string[]) {
    return fields.map(field => new OwnedSearchByRegexField(field));
  }

  onCancel() {
    this.dialogRef.close();
  }

  setIsJsonMode(mode: boolean) {
    this.isJsonMode = mode;
  }

}
