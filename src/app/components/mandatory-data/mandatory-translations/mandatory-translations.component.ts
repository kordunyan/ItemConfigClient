import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ItemFieldConfig } from 'src/app/shared/domain/item-field-config';
import { DialogService } from 'src/app/shared/service/dialog.service';
import { Language } from 'src/app/shared/domain/language';
import { MandatoryTranslation } from 'src/app/shared/domain/mandatory-translation';

@Component({
  selector: 'app-mandatory-translations',
  templateUrl: './mandatory-translations.component.html',
  styleUrls: ['./mandatory-translations.component.css']
})
export class MandatoryTranslationsComponent implements OnInit, OnChanges {

  @Input('itemFieldConfig') itemFieldConfig: ItemFieldConfig;
  @Input('languages') languages: Language[] = [];
  languagesToSelect: string[] = [];

  constructor(
    private dialogService: DialogService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.languagesToSelect = this.languages.map(language => language.name);
  }

  reset() {
    this.itemFieldConfig.mandatoryTranslations.forEach(mandatoryTranslation => mandatoryTranslation.selected = false);
  }

  addTranslation() {
    this.dialogService.openSelectValuesDialog(this.languagesToSelect, 'Selected Languages')
      .subscribe((selectedLanguageNames: string[]) => {
        this.addNewMandatoryTrnalsations(this.getLanguagesByNames(selectedLanguageNames));
        this.filterLanguagesToSelect(selectedLanguageNames);
    });
  }

  addNewMandatoryTrnalsations(languages: Language[]) {
    languages.map(language => new MandatoryTranslation(language))
      .forEach(mandatorytranslation => this.itemFieldConfig.mandatoryTranslations.push(mandatorytranslation));
  }

  getLanguagesByNames(names: string[]): Language[] {
    return this.languages.filter(language => names.indexOf(language.name) > -1);
  }

  filterLanguagesToSelect(selectedLanguages: string[]) {
    this.languagesToSelect = this.languagesToSelect.filter(language => selectedLanguages.indexOf(language) < 0);
  }

}
