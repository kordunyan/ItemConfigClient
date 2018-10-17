import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ItemFieldConfig } from 'src/app/shared/domain/item-field-config';
import { FieldConfig } from 'src/app/shared/domain/field-config';
import { DialogService } from 'src/app/shared/service/dialog.service';
import { MandatoryField } from 'src/app/shared/domain/mandatory-field';

@Component({
  selector: 'app-mandatory-fields',
  templateUrl: './mandatory-fields.component.html',
  styleUrls: ['./mandatory-fields.component.css']
})
export class MandatoryFieldsComponent implements OnInit, OnChanges {

  @Input('itemFieldConfig') itemFieldConfig: ItemFieldConfig;
  @Input('instructionsFieldConfigs') instructionsFieldConfigs: FieldConfig[]; 
  fieldConfigsToSelect: string[] = [];

  constructor(
    private dialogService: DialogService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.fieldConfigsToSelect = this.instructionsFieldConfigs.map(fieldConfig => fieldConfig.name);
  }

  addField() {
    this.dialogService.openSelectValuesDialog(this.fieldConfigsToSelect)
    .subscribe((selectedFieldConfigNames: string[]) => {
      this.addNewMandatoryFields(this.getFieldConfigsByNames(selectedFieldConfigNames));
      this.filterFieldConfigsToSelect(selectedFieldConfigNames);
    });
  }

  filterFieldConfigsToSelect(fieldConfigNames: string[]) {
    this.fieldConfigsToSelect = this.fieldConfigsToSelect.filter(fieldName => fieldConfigNames.indexOf(fieldName) < 0);
  }

  addNewMandatoryFields(newFieldConfigs: FieldConfig[]) {
    const newMandatoryFields = newFieldConfigs.map(fieldConfig => new MandatoryField(fieldConfig));
    this.itemFieldConfig.mandatoryFields = this.itemFieldConfig.mandatoryFields.concat(newMandatoryFields);
  }

  reset() {
    this.itemFieldConfig.mandatoryFields.forEach(fieldConfig => fieldConfig.selected = false);
  }

  getFieldConfigsByNames(fieldConfigNames: string[]): FieldConfig[] {
    return this.instructionsFieldConfigs.filter(fieldConfig => fieldConfigNames.indexOf(fieldConfig.name) > -1);
  }

}
