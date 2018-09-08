import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Item } from '../../../shared/domain/item';
import { ItemFieldsHolder } from '../../../shared/utils/item-field-holder';
import { FieldConfig } from '../../../shared/domain/field-config';
import { Field } from '../../../shared/domain/field';
import { FieldHttpService } from '../../../shared/service/http/field-http.service';
import { FieldService } from '../../../shared/service/field.service';
import { ProgressBarService } from '../../../shared/service/progress-bar.service';
import { ItemHttpService } from '../../../shared/service/http/item-http.service';
import { Router } from '@angular/router';
import {AppProperties} from '../../../shared/domain/app-properties';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {
  @Input('show') show: {isShow: boolean};
  @Input('item') item: Item;
  @Input('fieldConfigs') fieldConfigs;
  @Output("onChangeForAllItems") onChangeForAll = new EventEmitter<any>();
  @Output("onSavedNewFieldsForAll") onSaveNewFieldForAll = new EventEmitter<Field[]>();
  @Output("onDeletedItem") onDeletedItem = new EventEmitter<Item>();

  multipleFieldsOrder = AppProperties.MULTIPLE_FIELDS_SORT_ORDER;
  itemFieldsHolder: ItemFieldsHolder;

  constructor (
    private fieldService: FieldService,
    private progressBarService: ProgressBarService,
    private itemHttpService: ItemHttpService,
    private router: Router
  ) { }

  ngOnInit() {
    this.itemFieldsHolder = new ItemFieldsHolder(this.item, this.fieldConfigs);
  }

  onShow() {
    this.show.isShow = !this.show.isShow;
  }

  onChoseFields(fieldConfigNames: string[]) {
    this.itemFieldsHolder.createNewItemFields(fieldConfigNames);
  }

  onSaveNewFieldsForAll(fields: Field[]) {
    this.onSaveNewFieldForAll.emit(fields);  
  }

  onSavedForAllItems() {
    this.onChangeForAll.emit(null);
  }

  allUpdated() {
    this.onChangeForAll.emit(null);  
  }

  onSaveNewFields(newFields: Field[]) {
    this.progressBarService.show();
    this.fieldService.saveFieldsForItem(newFields, this.item).subscribe(
      (result) => {
        this.progressBarService.hide();
        this.onChangeForAll.emit(null);
      },
      (error) => {
        this.progressBarService.hide();
      }
    );
  }

  onDelete() {
    this.progressBarService.show();
    this.itemHttpService.delete(Item.copyWithoutFields(this.item)).subscribe(
      (result) => {
        this.progressBarService.hide();
        this.onDeletedItem.emit(this.item);
      },
      (error) => this.progressBarService.hide()
    );
  }

  onFieldDeleted(field: Field) {
    this.itemFieldsHolder.deleteField(field);
  }

  onCopyCLick() {
    this.router.navigate(['/items/new', {id: this.item.id}]);
  }

  onGoItemFieldConfig() {
    this.router.navigate(['/item-field-config', this.item.id]);
  }

}
