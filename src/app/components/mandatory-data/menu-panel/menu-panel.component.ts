import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { Item } from 'src/app/shared/domain/item';
import { ItemManager } from 'src/app/shared/utils/item.manager';
import { AppProperties } from 'src/app/shared/domain/app-properties';
import { RboCodeService } from 'src/app/shared/service/rbo-code.service';
import { Router } from '@angular/router';
import { ItemFieldConfig } from 'src/app/shared/domain/item-field-config';

@Component({
  selector: 'app-menu-panel',
  templateUrl: './menu-panel.component.html',
  styleUrls: ['./menu-panel.component.css']
})
export class MenuPanelComponent implements OnInit, OnChanges {

  @Input('item') item: Item;
  @Input('selectedItemFieldConfig') selectedItemFieldConfig: ItemFieldConfig;
  @Output('multipleEdit') multipleEdit = new EventEmitter();
  itemNumber: string;

  constructor(
    private router: Router,
    private rboCodeService: RboCodeService
  ) { }

  ngOnInit() {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.item) {
      this.itemNumber = ItemManager.getItemFieldValue(this.item, AppProperties.FIELD_D2COMM_ITEM_NUMBER);
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

}
