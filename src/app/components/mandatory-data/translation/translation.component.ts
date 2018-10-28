import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MandatoryTranslation } from 'src/app/shared/domain/mandatory-translation';

@Component({
  selector: 'app-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.css']
})
export class TranslationComponent implements OnInit {

  @Input('mandatoryTranslation') mandatoryTranslation: MandatoryTranslation;
  @Output('changedSelection') changedSelection = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  selected() {
    this.mandatoryTranslation.selected = !this.mandatoryTranslation.selected;
    this.changedSelection.emit(this.mandatoryTranslation.selected);
  }

}
