import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ItemFieldConfig} from '../../../shared/domain/item-field-config';
import {MandatoryDataCheck} from '../../../shared/domain/mandatory-data-check';
import {ArrayUtils} from '../../../shared/utils/array-utils';
import {Language} from '../../../shared/domain/language';
import {FieldConfig} from '../../../shared/domain/field-config';

@Component({
  selector: 'app-data-checker-panel',
  templateUrl: './data-checker-panel.component.html',
  styleUrls: ['./data-checker-panel.component.css']
})
export class DataCheckerPanelComponent implements OnInit, OnChanges {

  @Input() itemFieldConfig: ItemFieldConfig;
  @Input() allLanguages: Language[] = [];
  @Input() allFieldConfigs: FieldConfig[] = [];

  selectedIndex = 0;
  selectedMandatoryDataCheck: MandatoryDataCheck;

  ngOnInit() {
    this.setDefaultMandatoryDataCheck();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setDefaultMandatoryDataCheck();
  }

  setDefaultMandatoryDataCheck() {
    if (ArrayUtils.isNotEmpty(this.itemFieldConfig.mandatoryDataChecks)) {
      ArrayUtils.sort(this.itemFieldConfig.mandatoryDataChecks, o => o.id);
      let idx = 0;
      if (this.itemFieldConfig.selectedMandatoryDataCheckIdx) {
        idx = this.itemFieldConfig.selectedMandatoryDataCheckIdx;
      }
      this.selectedMandatoryDataCheck = this.itemFieldConfig.mandatoryDataChecks[idx];
      this.selectedIndex = idx;
    } else {
      this.itemFieldConfig.mandatoryDataChecks = [];
      this.selectedMandatoryDataCheck = null;
    }
  }

  addNewMandatoryDataCheck() {
    this.itemFieldConfig.mandatoryDataChecks.push(new MandatoryDataCheck());
    this.changeDataChecker(this.itemFieldConfig.mandatoryDataChecks.length - 1);
  }

  changeDataChecker(selectedIndex) {
    this.selectedIndex = selectedIndex;
    this.itemFieldConfig.selectedMandatoryDataCheckIdx = this.selectedIndex;
    this.selectedMandatoryDataCheck = this.itemFieldConfig.mandatoryDataChecks[this.selectedIndex];
  }

}
