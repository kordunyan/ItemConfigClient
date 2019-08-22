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

  @Input() itemFieldConfig: ItemFieldConfig;
  @Input() languages: Language[] = [];
  @Input() height = '100px';

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.sortMandatoryTranslations();
  }

  changedSelection(selected) {
    if (selected) {
      this.itemFieldConfig.hasSelectedMandatoryData = true;
    }
    this.itemFieldConfig.hasSelectedMandatoryData = ItemFieldConfigManager.hasSelectedMandatoryData(this.itemFieldConfig);
  }

  private sortMandatoryTranslations() {
    // this.itemFieldConfig.mandatoryTranslations.sort((f1, f2) => {
    //   return f1.language.name.localeCompare(f2.language.name);
    // });
  }

  reset() {
    this.toggle(false);
  }

  selectAll() {
    this.toggle(true);
  }

  toggle(selected: boolean) {
    // this.itemFieldConfig.mandatoryTranslations.forEach(mandatoryTranslation => mandatoryTranslation.selected = selected);
    // this.itemFieldConfig.hasSelectedMandatoryData = ItemFieldConfigManager.hasSelectedMandatoryData(this.itemFieldConfig);
  }

  addTranslation(selectedLanguages: Language[]) {
    this.addNewMandatoryTrnalsations(selectedLanguages);
    this.sortMandatoryTranslations();
    this.itemFieldConfig.hasNewMandatoryData = true;
  }

  addNewMandatoryTrnalsations(languages: Language[]) {
    const newTranslations = languages.map(language => new MandatoryTranslation(language));
    //this.itemFieldConfig.mandatoryTranslations = this.itemFieldConfig.mandatoryTranslations.concat(newTranslations);
  }
}
