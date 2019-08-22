import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ItemFieldConfig} from 'src/app/shared/domain/item-field-config';
import {FieldConfig} from 'src/app/shared/domain/field-config';
import {MandatoryField} from 'src/app/shared/domain/mandatory-field';
import {ItemFieldConfigManager} from '../../../shared/utils/item-field-config-manager';

@Component({
  selector: 'app-mandatory-fields',
  templateUrl: './mandatory-fields.component.html',
  styleUrls: ['./mandatory-fields.component.css']
})
export class MandatoryFieldsComponent {

  @Input('itemFieldConfig') itemFieldConfig: ItemFieldConfig;
  @Input('instructionsFieldConfigs') instructionsFieldConfigs: FieldConfig[];
  @Input('height') height: string = '100px';

  constructor() {
  }

  changedSelection(selected) {
    if (selected) {
      this.itemFieldConfig.hasSelectedMandatoryData = true;
    }
    this.itemFieldConfig.hasSelectedMandatoryData = ItemFieldConfigManager.hasSelectedMandatoryData(this.itemFieldConfig);
  }

  addFields(selectedFieldConfigs: FieldConfig[]) {
    this.addNewMandatoryFields(selectedFieldConfigs);
    this.itemFieldConfig.hasNewMandatoryData = true;
  }

  addNewMandatoryFields(newFieldConfigs: FieldConfig[]) {
    const newMandatoryFields = newFieldConfigs.map(fieldConfig => new MandatoryField(fieldConfig));
    //this.itemFieldConfig.mandatoryFields = this.itemFieldConfig.mandatoryFields.concat(newMandatoryFields);
  }

  reset() {
    this.toggle(false);
  }

  selectAll() {
    this.toggle(true);
  }

  toggle(selected: boolean) {
    //this.itemFieldConfig.mandatoryFields.forEach(fieldConfig => fieldConfig.selected = selected);
    //this.itemFieldConfig.hasSelectedMandatoryData = ItemFieldConfigManager.hasSelectedMandatoryData(this.itemFieldConfig);
  }
}
