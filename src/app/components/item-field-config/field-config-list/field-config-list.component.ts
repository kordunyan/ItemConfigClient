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

  itemFieldConfigs: ItemFieldConfig[] = [
    new ItemFieldConfig('GARMENT_PART_MAIN_0', true, true, true, null, null, '^.*1*.$', false, true, 1),
    new ItemFieldConfig('GARMENT_PART_MAIN_0_FIBER_1', true, true, true, null, 'cotton', null, false, true, 2),
    new ItemFieldConfig('GARMENT_PART_MAIN_0_FIBER_2', true, true, true, null, null, null, false, true, 3),
    new ItemFieldConfig('GARMENT_PART_MAIN_0_FIBER_3', true, true, true, null, null, null, true, true, 4),
    new ItemFieldConfig('GARMENT_PART_MAIN_0_FIBER_4', true, true, true, null, null, null, false, true, 5), 
    new ItemFieldConfig('GARMENT_PART_MAIN_0_FIBER_5', true, true, true, null, null, null, false, false, 6),
    new ItemFieldConfig('GARMENT_PART_MAIN_1', false, true, true, null, null, null, false, true, 7),
    new ItemFieldConfig('GARMENT_PART_MAIN_1_FIBER_1', true, true, true, 'Source Name', null, null, false, true, 8),
    new ItemFieldConfig('GARMENT_PART_MAIN_1_FIBER_2', true, false, true, null, null, null, false, true, 9),
    new ItemFieldConfig('GARMENT_PART_MAIN_1_FIBER_3', true, true, true, null, null, null, false, true, 10),
    new ItemFieldConfig('GARMENT_PART_MAIN_1_FIBER_4', true, true, true, null, null, null, false, true, 11),
    new ItemFieldConfig('GARMENT_PART_MAIN_1_FIBER_5', true, true, true, null, null, null, false, true, 12),
    new ItemFieldConfig('GARMENT_PART_MAIN_2', true, true, true, null, null, null, false, true, 13),
    new ItemFieldConfig('GARMENT_PART_MAIN_2_FIBER_1', true, true, true, null, null, null, false, true, 14),
    new ItemFieldConfig('GARMENT_PART_MAIN_2_FIBER_2', true, true, true, null, null, null, false, true, 15),
    new ItemFieldConfig('GARMENT_PART_MAIN_2_FIBER_3', true, true, true, null, null, null, false, true, 16),
    new ItemFieldConfig('GARMENT_PART_MAIN_2_FIBER_4', true, true, true, null, null, null, false, true, 17),
    new ItemFieldConfig('GARMENT_PART_MAIN_2_FIBER_5', true, true, true, null, null, null, false, true, 18),
    new ItemFieldConfig('GARMENT_PART_MAIN_3', true, true, true, null, null, null, false, true, 19),
    new ItemFieldConfig('GARMENT_PART_MAIN_3_FIBER_1', true, true, true, null, null, null, false, true, 20),
    new ItemFieldConfig('GARMENT_PART_MAIN_3_FIBER_2', true, true, true, null, null, null, false, true, 21),
    new ItemFieldConfig('STYLE', true, true, true, null, null, null, false, true,22),
    new ItemFieldConfig('EOD', true, true, true, null, null, null, false, true, 23),
    new ItemFieldConfig('COO', true, true, true, null, null, null, false, true, 24),
  ];

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
