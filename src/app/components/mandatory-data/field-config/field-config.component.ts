import { Component, OnInit, Input } from '@angular/core';
import { MandatoryField } from 'src/app/shared/domain/mandatory-field';

@Component({
  selector: 'app-field-config',
  templateUrl: './field-config.component.html',
  styleUrls: ['./field-config.component.css']
})
export class FieldConfigComponent implements OnInit {

  @Input('mandatoryField') mandatoryField: MandatoryField;

  constructor() { }

  ngOnInit() {
  }

  selected() {
    this.mandatoryField.selected = !this.mandatoryField.selected;
  }

}
