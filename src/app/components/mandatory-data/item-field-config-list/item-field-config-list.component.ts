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
import {FieldConfig} from 'src/app/shared/domain/field-config';
import { InstructionTypeInputConfigHttpService } from 'src/app/shared/service/http/instruction-type-input-config-http.service';
import { Item } from 'src/app/shared/domain/item';

@Component({
  selector: 'app-item-field-config-list',
  templateUrl: './item-field-config-list.component.html',
  styleUrls: ['./item-field-config-list.component.css']
})
export class ItemFieldConfigListComponent implements OnInit {

  itemFieldConfigs: ItemFieldConfig[] = [];
  instructionsFields = {};
  instructionsFieldCofigsMap = {};
  languages: Language[] = [];
  selectedItemFieldConfig: ItemFieldConfig = ItemFieldConfig.default(FieldConfig.default());
  selectedInstructionFieldConfigs: FieldConfig[] = [];
  item: Item;

  constructor(
    private itemFieldConfigHttpService: ItemFieldConfigHttpService,
    private fieldConfigHttpService: FieldConfigHttpService,
    private languageHttpService: LanguageHttpService,
    private route: ActivatedRoute,
    private progressBarService: ProgressBarService,
    private itemHttpService: ItemHttpService,
    private instructionConfigHttpService: InstructionTypeInputConfigHttpService
  ) {
  }

  ngOnInit() {
    this.progressBarService.show();
    const itemId = this.route.snapshot.paramMap.get(AppProperties.REQUEST_PARAM_ITEM_ID);
    forkJoin(
      this.itemFieldConfigHttpService.getInstructionsByItemId(itemId),
      this.fieldConfigHttpService.getInstructionsFields(),
      this.fieldConfigHttpService.getInstructionsFieldConfigsMap(),
      this.itemHttpService.getByIdWithoutItemFieldConfig(itemId),
      this.instructionConfigHttpService.getInstructionsLanguages()
    ).subscribe((result) => {
      // result[0] = item field configs, result[1] = instructions fields, result[2] = instructions field configs map, result[3] = item
      console.log(result);
      this.itemFieldConfigs = result[0];
      this.instructionsFields = result[1];
      this.instructionsFieldCofigsMap = result[2];
      this.item = result[3];
      
      this.progressBarService.hide();
    }, (error) => this.progressBarService.hide());
  }

  select(itemFieldConfig: ItemFieldConfig) {
    this.selectedItemFieldConfig = itemFieldConfig;
    this.selectedInstructionFieldConfigs = this.getSelectedInstructionFieldConfigs();
  }

  getSelectedInstructionFieldConfigs(): FieldConfig[] {
    const instructionFields = this.instructionsFields[this.selectedItemFieldConfig.fieldConfig.name];
    if (instructionFields && instructionFields.length > 0) {
      let result: FieldConfig[] = [];
      instructionFields.forEach(fieldName => result.push(this.instructionsFieldCofigsMap[fieldName]));
      return result;
    }
    return [];
  }

}
