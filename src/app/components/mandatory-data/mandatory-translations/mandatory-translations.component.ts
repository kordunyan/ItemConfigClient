import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ItemFieldConfig} from 'src/app/shared/domain/item-field-config';
import {DialogService} from 'src/app/shared/service/dialog.service';
import {Language} from 'src/app/shared/domain/language';
import {MandatoryTranslation} from 'src/app/shared/domain/mandatory-translation';
import {SaveMandatoryDataDto} from '../../../shared/dto/save-mandatory-data.dto';
import {MandatoryTranslationsHttpService} from '../../../shared/service/http/mandatory-translations-http.service';
import {ProgressBarService} from '../../../shared/service/progress-bar.service';
import {transition} from '@angular/animations';

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
    private dialogService: DialogService,
    private mandatoryTranslationsHttpService: MandatoryTranslationsHttpService,
    private progressBarService: ProgressBarService
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

  reset() {
    this.itemFieldConfig.mandatoryTranslations.forEach(mandatoryTranslation => mandatoryTranslation.selected = false);
  }

  save() {
    const newMandatoryTranslations = this.getNewMandatoryTranslations();
    if (!newMandatoryTranslations || newMandatoryTranslations.length === 0) {
      return;
    }
    console.log(this.buildSaveMandatoryDataDto(this.getNewMandatoryTranslations(), false));
    this.progressBarService.show();
    this.mandatoryTranslationsHttpService.save(this.buildSaveMandatoryDataDto(this.getNewMandatoryTranslations(), false))
      .subscribe(result => {
        this.updateMandatoryTranslations(result);
        this.sortMandatoryTranslations();
        this.progressBarService.hide();
      }, error => this.progressBarService.hide());
  }

  saveForItemNumber() {
    this.dialogService.openSaveForAllStrategyDialog().subscribe(
      (saveForAllStrategy: string) => {
        console.log(this.buildSaveMandatoryDataDto(this.itemFieldConfig.mandatoryTranslations, true, saveForAllStrategy));
      }
    );
  }


  private updateMandatoryTranslations(saveMandatoryTranslations: MandatoryTranslation[]) {
    this.itemFieldConfig.mandatoryTranslations = this.itemFieldConfig.mandatoryTranslations.filter(translation => translation.id);
    this.itemFieldConfig.mandatoryTranslations = this.itemFieldConfig.mandatoryTranslations.concat(saveMandatoryTranslations);
  }

  private sortMandatoryTranslations() {
    this.itemFieldConfig.mandatoryTranslations.sort((f1, f2) => {
      return f1.language.name.localeCompare(f2.language.name);
    });
  }

  buildSaveMandatoryDataDto(newTranslations: MandatoryTranslation[], saveForAll: boolean, strategy?: string): SaveMandatoryDataDto {
    return new SaveMandatoryDataDto(this.itemFieldConfig, saveForAll, newTranslations, strategy);
  }

  getNewMandatoryTranslations(): MandatoryTranslation[] {
    return this.itemFieldConfig.mandatoryTranslations.filter(translation => !translation.id);
  }

  addTranslation() {
    this.dialogService.openSelectValuesDialog(this.languagesToSelect, 'Selected Languages')
      .subscribe((selectedLanguageNames: string[]) => {
        this.addNewMandatoryTrnalsations(this.getLanguagesByNames(selectedLanguageNames));
        this.sortMandatoryTranslations();
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
