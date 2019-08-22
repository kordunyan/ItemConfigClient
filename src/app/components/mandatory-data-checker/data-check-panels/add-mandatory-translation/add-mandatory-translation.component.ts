import {Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter} from '@angular/core';
import {Language} from 'src/app/shared/domain/language';
import {MandatoryTranslation} from 'src/app/shared/domain/mandatory-translation';
import {DialogService} from 'src/app/shared/service/dialog.service';

@Component({
  selector: 'app-add-mandatory-translation',
  templateUrl: './add-mandatory-translation.component.html',
  styleUrls: ['./add-mandatory-translation.component.css']
})
export class AddMandatoryTranslationComponent implements OnChanges {

  @Input() mandatoryTranslations: MandatoryTranslation[];
  @Input() languages: Language[] = [];
  @Output() addNewData = new EventEmitter<string[]>();
  languagesToSelect: Language[] = [];

  constructor(private dialogService: DialogService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.languagesToSelect = this.languages
      .filter(language => this.mandatoryTranslations.findIndex(translation =>
        translation.language.code === language.code) < 0);
  }

  onAdd() {
    this.dialogService.openOptionsSelectDialog(this.languagesToSelect, 'Selected Languages', (language) => language.name)
      .subscribe(selectedLanguages => {
        this.addNewData.emit(selectedLanguages);
      });
  }
}
