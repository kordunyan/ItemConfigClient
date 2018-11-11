import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { startWith, map } from 'rxjs/operators';
import { DocumentUtils } from '../../utils/document-utils';
import { MessageService } from '../../service/message.service';
import { InsertOptionDialog } from '../insert-options-dialog/insert-option-dialog';
import { ArrayUtils } from '../../utils/array-utils';

@Component({
  selector: 'app-options-select-dialog',
  templateUrl: './options-select-dialog.html',
  styleUrls: ['./options-select-dialog.css']
})
export class OptionsSelectDialog {

  optionValueInput = new FormControl();
  title = '';
  options: SelectableOption[] = [];
  optionsMap = {};
  filteredOptions: SelectableOption[] = [];
  allOptionsSelected = false;

  constructor(
    public dialogRef: MatDialogRef<OptionsSelectDialog>,
    private messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) data: any,
    public dialog: MatDialog
  ) { 
    this.title = data.title;
    this.createSelectableOptions(data.options, data.getFieldValueFunction);
    this.createSelectableOptionsMap();
    this.initFilter();
  }

  createSelectableOptions(options: any[], getFieldValueFunction) {
    this.options = options.map(option => new SelectableOption(option, getFieldValueFunction));
  }

  createSelectableOptionsMap() {
    this.options.forEach(option => {
      this.optionsMap[option.getValue()] = option;
    });
  }

  initFilter() {
    this.optionValueInput.valueChanges
      .pipe(
        startWith<string>(''),
        map(filterValue => {
          try {
            return new RegExp(filterValue, 'i');
          } catch (e) {
            return new RegExp('', 'i');
          }
        }),
        map(filterRegex => this.filter(filterRegex))
      )
      .subscribe(result => {
        this.filteredOptions = result;
        this.updateSelectedAll();
      })
  }

  filter(filterRegexp: RegExp) {
    return this.options.filter(option => filterRegexp.test(option.getValue()));
  }
  
  updateSelectedAll() {
    this.allOptionsSelected = this.getSelectedFilteredOptions().length === this.filteredOptions.length && this.filteredOptions.length !== 0;
  }

  selectDeselectAll() {
    this.filteredOptions.forEach(option => option.selected = this.allOptionsSelected);
  }

  select(option) {
    option.inverseSelect();
    this.updateSelectedAll();
  }

  getSelectedFilteredOptions() {
    return this.filteredOptions.filter(option => option.selected);
  }

  getSelectedOptions(): any[] {
    return this.options.filter(option => option.selected)
      .map(selectableOption => selectableOption.option);
  }

  resetSelected() {
    this.options.forEach(option => option.selected = false);  
  }

  copyToBuffer() {
    const joinedOptions = this.options.map(option => option.getValue()).join(',\n');
    if (DocumentUtils.clipboard(joinedOptions)) {
      this.messageService.info('Options were coppied to buffer');
    }
  }

  openInsertOptios() {
    this.dialog.open(InsertOptionDialog, {
      width: '400px',
    }).beforeClose().subscribe(result => {
      if (ArrayUtils.isNotEmpty(result)) {
          result.forEach(optionName => {
            const option = this.optionsMap[optionName];
            if (option) {
              option.select();
            } 
          });
          this.updateSelectedAll();
      }
    })
  }

  ok() {
    this.dialogRef.close(this.getSelectedOptions());
  }

  close() {
    this.dialogRef.close();
  }

}

class SelectableOption {
  constructor(
    public option: any, 
    private getOptionValueFunc, 
    public selected: boolean = false) {
  }

  public getValue() {
    return this.getOptionValueFunc(this.option);
  }

  public select() {
    this.selected = true;
  }

  public deselect() {
    this.selected = false;
  }

  public inverseSelect() {
    this.selected = !this.selected;
  }
}
