import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FieldConfig} from '../../../../shared/domain/field-config';
import {MandatoryDataCheck} from '../../../../shared/domain/mandatory-data-check';
import {MandatoryField} from '../../../../shared/domain/mandatory-field';
import {ArrayUtils} from '../../../../shared/utils/array-utils';

@Component({
  selector: 'app-mandatory-fields',
  templateUrl: './mandatory-fields.component.html',
  styleUrls: ['./mandatory-fields.component.css']
})
export class MandatoryFieldsComponent implements OnChanges {

  @Input() instructionsFieldConfigs: FieldConfig[];
  @Input() mandatoryDataCheck: MandatoryDataCheck;
  @Input() height = '500px';

  ngOnChanges(changes: SimpleChanges): void {
    this.sortFieldConfigs();
  }

  addFields(selectedFieldConfigs: FieldConfig[]) {
    this.addNewMandatoryFields(selectedFieldConfigs);
  }

  addNewMandatoryFields(newFieldConfigs: FieldConfig[]) {
    const newMandatoryFields = newFieldConfigs.map(fieldConfig => new MandatoryField(fieldConfig));
    this.mandatoryDataCheck.mandatoryFields = this.mandatoryDataCheck.mandatoryFields.concat(newMandatoryFields);
    this.sortFieldConfigs();
  }

  sortFieldConfigs() {
    ArrayUtils.sort(this.mandatoryDataCheck.mandatoryFields, o => o.fieldConfig.name);
  }

}
