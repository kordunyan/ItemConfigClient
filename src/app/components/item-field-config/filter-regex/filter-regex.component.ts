import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ItemFieldConfig } from '../../../shared/domain/item-field-config';
import { DialogService } from '../../../shared/service/dialog.service';

@Component({
  selector: 'app-filter-regex',
  templateUrl: './filter-regex.component.html',
  styleUrls: ['./filter-regex.component.css']
})
export class FilterRegexComponent {

  @Input('itemFieldConfig') itemFieldConfig: ItemFieldConfig;
  @Input('instructionsFields') instructionsFields = {};
  @Output('regexChanged') regexChanged = new EventEmitter();

  constructor(private dialogService: DialogService) { }

  onEditFilterRegex(itemFieldConfig: ItemFieldConfig) {
    this.dialogService.openFilterRegexDialog(itemFieldConfig, this.getInstructionFields(itemFieldConfig))
      .subscribe(result => {
        this.regexChanged.emit(result);
      });
  }

  getInstructionFields(itemFieldConfig: ItemFieldConfig) {
    return this.instructionsFields[itemFieldConfig.fieldConfig.type];
  }

}
