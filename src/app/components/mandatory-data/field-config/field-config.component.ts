import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { MandatoryField } from 'src/app/shared/domain/mandatory-field';

@Component({
  selector: 'app-field-config',
  templateUrl: './field-config.component.html',
  styleUrls: ['./field-config.component.css']
})
export class FieldConfigComponent implements OnInit {

  @Input('mandatoryField') mandatoryField: MandatoryField;
  @Output('changedSelection') changedSelection = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  selected() {
    this.mandatoryField.selected = !this.mandatoryField.selected;
    this.changedSelection.emit(this.mandatoryField.selected);
  }

}
