import {Component, OnInit} from '@angular/core';
import {ItemFieldConfigHttpService} from 'src/app/shared/service/http/item-field-config-http.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {forkJoin} from 'rxjs';
import {first, switchMap} from 'rxjs/operators';
import {AppProperties} from 'src/app/shared/domain/app-properties';
import {ItemFieldConfig} from 'src/app/shared/domain/item-field-config';
import {FieldConfigHttpService} from 'src/app/shared/service/http/field-config-http.service';
import {LanguageHttpService} from 'src/app/shared/service/http/language-http.service';
import {Language} from 'src/app/shared/domain/language';
import {ProgressBarService} from 'src/app/shared/service/progress-bar.service';
import {ItemHttpService} from '../../../shared/service/http/item-http.service';

@Component({
  selector: 'app-item-field-config-list',
  templateUrl: './item-field-config-list.component.html',
  styleUrls: ['./item-field-config-list.component.css']
})
export class ItemFieldConfigListComponent implements OnInit {

  itemFieldConfigs: ItemFieldConfig[] = [];
  instructionsFields = {};
  languages: Language[] = [];
  selectedItemFieldConfig: ItemFieldConfig = ItemFieldConfig.default('');

  constructor(
    private itemFieldConfigHttpService: ItemFieldConfigHttpService,
    private fieldConfigHttpService: FieldConfigHttpService,
    private languageHttpService: LanguageHttpService,
    private route: ActivatedRoute,
    private progressBarService: ProgressBarService,
    private itemHttpService: ItemHttpService
  ) {
  }

  ngOnInit() {
    this.progressBarService.show();
    forkJoin(
      this.route.paramMap.pipe(
        first(),
        switchMap((params: ParamMap) => {
          return this.itemFieldConfigHttpService.getInstructionsByItemId(params.get(AppProperties.REQUEST_PARAM_ITEM_ID));
        })),
      this.fieldConfigHttpService.getInstructionsFields(),
      this.languageHttpService.getAll()
    ).subscribe((result) => {
      //result[0] = item field configs, result[1] = instructions fields,  result[2] = languages
      this.itemFieldConfigs = result[0];
      this.instructionsFields = result[1];
      this.languages = result[2];
      this.progressBarService.hide();
    }, (error) => this.progressBarService.hide());
  }

  select(itemFieldConfig: ItemFieldConfig) {
    this.selectedItemFieldConfig = itemFieldConfig;
  }

}
