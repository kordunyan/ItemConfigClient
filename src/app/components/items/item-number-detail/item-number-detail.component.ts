import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {ItemHttpService} from '../../../shared/service/http/item-http.service';
import {switchMap, delay, first} from 'rxjs/operators';
import {Item} from '../../../shared/domain/item';
import {forkJoin, of} from 'rxjs';
import {FieldConfigHttpService} from '../../../shared/service/http/field-config-http.service';
import {AppProperties} from '../../../shared/domain/app-properties';
import {FieldConfig} from '../../../shared/domain/field-config';
import {ProgressBarService} from '../../../shared/service/progress-bar.service';
import {Field} from '../../../shared/domain/field';
import {FieldService} from '../../../shared/service/field.service';
import {ItemManager} from '../../../shared/utils/item.manager';
import { RboCodeService } from '../../../shared/service/rbo-code.service';


@Component({
  selector: 'app-item-number-detail',
  templateUrl: './item-number-detail.component.html',
  styleUrls: ['./item-number-detail.component.css']
})
export class ItemNumberDetailComponent implements OnInit {

  items: Item[] = [];
  shownItems: { isShow: boolean }[] = [];
  fieldConfigs = {};
  itemNumber: string;
  isAllShow = false;

  constructor(
    private route: ActivatedRoute,
    private itemHttpService: ItemHttpService,
    private fieldConfigHttpService: FieldConfigHttpService,
    private progresBarService: ProgressBarService,
    public rboCodeService: RboCodeService,
    private fieldService: FieldService
  ) {
  }

  ngOnInit() {
    this.loadData(() => {
      if (this.items.length === 1) {
        this.shownItems.push({isShow: true});
      } else {
        for (let i = 0; i < this.items.length; i++) {
          this.shownItems.push({isShow: false});
        }
      }
    });
  }

  loadData(onLoadCallback?) {
    this.progresBarService.show();
    forkJoin(
      this.route.paramMap.pipe(
        first(),
        switchMap((params: ParamMap) => {
          this.itemNumber = params.get('itemNumber');
          return this.itemHttpService.getItemsByNumber(this.itemNumber);
        })
      ),
      this.fieldConfigHttpService.getByOwnerMap(AppProperties.OWNER_ITEM)
    ).subscribe((result: any) => {
      this.items = result[0];
      this.fieldConfigs = result[1];
      this.sortItems();
      if (onLoadCallback) {
        onLoadCallback(result);
      }
      this.progresBarService.hide();
    });
  }

  private sortItems() {
    ItemManager.sortItemsByMultipleFields(this.items, this.fieldService.getMultipleFieldNames());
  }

  onToggle() {
    this.isAllShow = !this.isAllShow;
    for (let i = 0; i < this.shownItems.length; i++) {
      this.shownItems[i].isShow = this.isAllShow;
    }
  }

  onDeletedItem(item: Item) {
    this.items.splice(this.items.findIndex(i => i.id === item.id), 1);
  }
}
