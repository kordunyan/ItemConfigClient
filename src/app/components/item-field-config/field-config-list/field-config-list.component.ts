import { Component, OnInit } from '@angular/core';
import { ItemFieldConfig } from '../../../shared/domain/item-field-config';
import { Item } from '../../../shared/domain/item';
import { ItemHttpService } from '../../../shared/service/http/item-http.service';
import { forkJoin } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { first, switchMap } from '../../../../../node_modules/rxjs/operators';
import { ProgressBarService } from '../../../shared/service/progress-bar.service';
import { FieldConfigHttpService } from '../../../shared/service/http/field-config-http.service';
import { ItemFieldConfigHolder } from '../../../shared/utils/item-field-config-holder';
import { FieldConfig } from '../../../shared/domain/field-config';
import { AppProperties } from '../../../shared/domain/app-properties';

@Component({
  selector: 'app-field-config-list',
  templateUrl: './field-config-list.component.html',
  styleUrls: ['./field-config-list.component.css']
})
export class FieldConfigListComponent implements OnInit {
  isLoaded = false;
  itemFieldConfigHolder: ItemFieldConfigHolder;

  constructor(
    private itemHttpService: ItemHttpService,
    private fieldConfigHttpService: FieldConfigHttpService,
    private route: ActivatedRoute,
    private progressBarService: ProgressBarService
  ) { }

  ngOnInit() {
    this.progressBarService.show();
    forkJoin(
      this.route.paramMap.pipe(
        first(),
        switchMap((params: ParamMap) => this.itemHttpService.getById(params.get(AppProperties.REQUEST_PARAM_ITEM_ID)))
      ),
      this.fieldConfigHttpService.getAll()
    ).subscribe(
      (result) => {
        this.itemFieldConfigHolder = new ItemFieldConfigHolder(result[0], result[1]);
        this.progressBarService.hide();
        this.isLoaded = true;
      }
    );
  }

  onReset() {
    this.progressBarService.show();
    this.itemFieldConfigHolder.resetItemFieldConfigs();
    this.progressBarService.hide();  
  }

  onItemFieldConfigChanged() {
    this.reloadItem();
  }

  reloadItem() {
    this.progressBarService.show();
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.itemHttpService.getById(params.get(AppProperties.REQUEST_PARAM_ITEM_ID))) 
    )
    .subscribe(
      (item: Item) => {
        this.itemFieldConfigHolder.setItem(item);
        this.progressBarService.hide();
      }, 
      (error) => {
        this.progressBarService.hide();
        console.error(error);
      });
  }

}
