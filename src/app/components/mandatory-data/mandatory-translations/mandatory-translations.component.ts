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
export class MandatoryTranslationsComponent implements OnChanges {

  @Input('itemFieldConfig') itemFieldConfig: ItemFieldConfig;
  @Input('languages') languages: Language[] = [];

  @Output('saveForCurrent') onSaveForCurrent = new EventEmitter();
  @Output('saveForItemNumber') onSaveForItemNumber = new EventEmitter<string[]>();
  @Output('delete') onDelete = new EventEmitter<{}>();

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
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

  addTranslation(selectedLanguageNames: string[]) {
    this.addNewMandatoryTrnalsations(this.getLanguagesByNames(selectedLanguageNames));
    this.sortMandatoryTranslations();
    this.itemFieldConfig.hasNewMandatoryData = true;
  }

  addNewMandatoryTrnalsations(languages: Language[]) {
    const newTranslations = languages.map(language => new MandatoryTranslation(language));
    this.itemFieldConfig.mandatoryTranslations = this.itemFieldConfig.mandatoryTranslations.concat(newTranslations);
  }

  getLanguagesByNames(names: string[]): Language[] {
    return this.languages.filter(language => names.indexOf(language.name) > -1);
  }

  delete(deleteOptions?: {}) {
    this.onDelete.emit(deleteOptions);
  }
}
