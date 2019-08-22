import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Item} from '../../../shared/domain/item';
import {ItemFieldConfig} from '../../../shared/domain/item-field-config';
import {ItemManager} from '../../../shared/utils/item.manager';
import {Router} from '@angular/router';
import {RboCodeService} from '../../../shared/service/rbo-code.service';

@Component({
  selector: 'app-menu-panel',
  templateUrl: './menu-panel.component.html',
  styleUrls: ['./menu-panel.component.css']
})
export class MenuPanelComponent implements OnInit, OnChanges {
  @Input() item: Item;
  @Input('selectedItemFieldConfig') selectedItemFieldConfig: ItemFieldConfig;

  @Output('multipleEdit') multipleEdit = new EventEmitter();
  @Output('delete') onDelete = new EventEmitter<{}>();
  @Output('saveForCurrent') onSaveForCurrent = new EventEmitter();
  @Output('saveForItemNumber') onSaveForItemNumber = new EventEmitter<any>();
  @Output('reset') onReset = new EventEmitter();

  itemNumber = '';

  constructor(
    private rboCodeService: RboCodeService,
    private router: Router
  ) {
  }

  ngOnInit() {
    console.log(this.item);
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

  save() {
    this.onSaveForCurrent.emit();
  }

}
