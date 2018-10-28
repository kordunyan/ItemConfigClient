import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Item } from 'src/app/shared/domain/item';
import { ItemManager } from 'src/app/shared/utils/item.manager';
import { AppProperties } from 'src/app/shared/domain/app-properties';
import { RboCodeService } from 'src/app/shared/service/rbo-code.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-panel',
  templateUrl: './menu-panel.component.html',
  styleUrls: ['./menu-panel.component.css']
})
export class MenuPanelComponent implements OnInit, OnChanges {

  @Input('item') item: Item;
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

}
