import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.css']
})
export class ChipsComponent {
  separatorKeysCodes = [ENTER, COMMA];
  
  @Input() visible: boolean = true;
  @Input() selectable: boolean = true;
  @Input() removable: boolean = true;
  @Input() addOnBlur: boolean = true;
  @Input() values: string[] = [];

  @Output('change') change = new EventEmitter();

  constructor() { }

  add(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;
    if ((value || '').trim()) {
      this.values.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
    this.change.emit();
  }

  remove(value: any): void {
    let index = this.values.indexOf(value);

    if (index >= 0) {
      this.values.splice(index, 1);
    }
    this.change.emit();
  }
}
