import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MandatoryDataCheck} from '../../../../shared/domain/mandatory-data-check';
import {Language} from '../../../../shared/domain/language';
import {MandatoryTranslation} from '../../../../shared/domain/mandatory-translation';

@Component({
  selector: 'app-mandatory-translations',
  templateUrl: './mandatory-translations.component.html',
  styleUrls: ['./mandatory-translations.component.css']
})
export class MandatoryTranslationsComponent implements OnChanges {

  @Input() mandatoryDataCheck: MandatoryDataCheck;
  @Input() languages: Language[] = [];
  @Input() height = '500px';

  constructor() {
  }

  addTranslation(selectedLanguages: Language[]) {
    this.addNewMandatoryTrnalsations(selectedLanguages);
    this.sortMandatoryTranslations();
  }

  addNewMandatoryTrnalsations(languages: Language[]) {
    const newTranslations = languages.map(language => new MandatoryTranslation(language));
    this.mandatoryDataCheck.mandatoryTranslations = this.mandatoryDataCheck.mandatoryTranslations.concat(newTranslations);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.sortMandatoryTranslations();
  }

  private sortMandatoryTranslations() {
    this.mandatoryDataCheck.mandatoryTranslations.sort((f1, f2) => {
      return f1.language.name.localeCompare(f2.language.name);
    });
  }

}
