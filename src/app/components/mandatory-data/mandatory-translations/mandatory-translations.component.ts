import {Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import {ItemFieldConfig} from 'src/app/shared/domain/item-field-config';
import {DialogService} from 'src/app/shared/service/dialog.service';
import {Language} from 'src/app/shared/domain/language';
import {MandatoryTranslation} from 'src/app/shared/domain/mandatory-translation';
import {ItemFieldConfigManager} from '../../../shared/utils/item-field-config-manager';

@Component({
  selector: 'app-mandatory-translations',
  templateUrl: './mandatory-translations.component.html',
  styleUrls: ['./mandatory-translations.component.css']
})
export class MandatoryTranslationsComponent implements OnInit, OnChanges {

  @Input('itemFieldConfig') itemFieldConfig: ItemFieldConfig;
  @Input('languages') languages: Language[] = [];

  @Output('saveForCurrent') onSaveForCurrent = new EventEmitter();
  @Output('saveForItemNumber') onSaveForItemNumber = new EventEmitter<string[]>();
  @Output('delete') onDelete = new EventEmitter<{}>();
  languagesToSelect: string[] = [];

  constructor(
    private dialogService: DialogService
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.languagesToSelect = this.languages
      .filter(language => this.itemFieldConfig.mandatoryTranslations.findIndex(translation =>
        translation.language.code === language.code) < 0)
      .map(language => language.name);
    this.sortMandatoryTranslations();
  }

  save() {
    this.onSaveForCurrent.emit();
  }

  saveForItemNumber(itemNumbers?: string[]) {
    this.onSaveForItemNumber.emit(itemNumbers);
  }

  changedSelection(selected) {
    if (selected) {
      this.itemFieldConfig.hasSelectedMandatoryData = true;
    }
    this.itemFieldConfig.hasSelectedMandatoryData = ItemFieldConfigManager.hasSelectedMandatoryData(this.itemFieldConfig);
  }

  private sortMandatoryTranslations() {
    this.itemFieldConfig.mandatoryTranslations.sort((f1, f2) => {
      return f1.language.name.localeCompare(f2.language.name);
    });
  }

  reset() {
    this.itemFieldConfig.mandatoryTranslations.forEach(mandatoryTranslation => mandatoryTranslation.selected = false);
    this.itemFieldConfig.hasSelectedMandatoryData = false;
  }

  addTranslation() {
    this.dialogService.openSelectValuesDialog(this.languagesToSelect, 'Selected Languages')
      .subscribe((selectedLanguageNames: string[]) => {
        this.addNewMandatoryTrnalsations(this.getLanguagesByNames(selectedLanguageNames));
        this.sortMandatoryTranslations();
        this.filterLanguagesToSelect(selectedLanguageNames);
        this.itemFieldConfig.hasNewMandatoryData = true;
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

  delete(deleteOptions?: {}) {
    this.onDelete.emit(deleteOptions);
  }
}
