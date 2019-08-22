import {Component, Input, OnInit} from '@angular/core';
import {MandatoryField} from '../../../../shared/domain/mandatory-field';

@Component({
  selector: 'app-field-config',
  templateUrl: './field-config.component.html',
  styleUrls: ['./field-config.component.css']
})
export class FieldConfigComponent {

  @Input() mandatoryField: MandatoryField;

  select() {
    this.mandatoryField.selected = !this.mandatoryField.selected;
  }

}
