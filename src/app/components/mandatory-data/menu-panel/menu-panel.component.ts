import {Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter} from '@angular/core';
import {Item} from 'src/app/shared/domain/item';
import {ItemManager} from 'src/app/shared/utils/item.manager';
import {AppProperties} from 'src/app/shared/domain/app-properties';
import {RboCodeService} from 'src/app/shared/service/rbo-code.service';
import {Router} from '@angular/router';
import {ItemFieldConfig} from 'src/app/shared/domain/item-field-config';
import {DialogService} from '../../../shared/service/dialog.service';
import {ItemFieldsCriteria} from '../../../shared/dto/item-fields-criteria.dto';

@Component({
  selector: 'app-menu-panel',
  templateUrl: './menu-panel.component.html',
  styleUrls: ['./menu-panel.component.css']
})
export class MenuPanelComponent implements OnInit, OnChanges {

  @Input('item') item: Item;
  @Input('selectedItemFieldConfig') selectedItemFieldConfig: ItemFieldConfig;

  @Output('multipleEdit') multipleEdit = new EventEmitter();
  @Output('delete') onDelete = new EventEmitter<{}>();
  @Output('saveForCurrent') onSaveForCurrent = new EventEmitter();
  @Output('saveForItemNumber') onSaveForItemNumber = new EventEmitter<any>();
  @Output('reset') onReset = new EventEmitter();

  itemNumber: string;

  constructor(
    private rboCodeService: RboCodeService,
    private dialogService: DialogService,
    private router: Router
  ) {
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.item) {
      this.itemNumber = ItemManager.getItemNumber(this.item);
    }
  }

  goBack() {
    this.router.navigate(['/items', this.itemNumber, this.rboCodeService.getRboObject()]);
  }

  goToItemFieldConfig() {
    this.router.navigate(['/item-field-config', this.item.id, this.rboCodeService.getRboObject()]);
  }

  onMultipleEdit() {
    this.multipleEdit.emit();
  }

  delete(deleteOptions?: {}) {
    this.onDelete.emit(deleteOptions);
  }

  save() {
    this.onSaveForCurrent.emit();
  }

  saveForItemNumber(saveOptions: any) {
    this.onSaveForItemNumber.emit({
      itemNumbers: saveOptions.itemNumbers,
      itemFieldsCriteria: saveOptions.fieldsCriteria
    });
  }

  onResetClick() {
    this.onReset.emit();
  }

}
