import {Component, Input} from '@angular/core';
import {MandatoryTranslation} from '../../../../shared/domain/mandatory-translation';

@Component({
  selector: 'app-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.css']
})
export class TranslationComponent {

  @Input() mandatoryTranslation: MandatoryTranslation;

  constructor() {
  }

  select() {
    this.mandatoryTranslation.selected = !this.mandatoryTranslation.selected;
  }

}
