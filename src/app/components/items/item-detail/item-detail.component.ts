import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Item} from '../../../shared/domain/item';
import {ItemFieldsHolder} from '../../../shared/utils/item-field-holder';
import {FieldConfig} from '../../../shared/domain/field-config';
import {Field} from '../../../shared/domain/field';
import {FieldHttpService} from '../../../shared/service/http/field-http.service';
import {FieldService} from '../../../shared/service/field.service';
import {ProgressBarService} from '../../../shared/service/progress-bar.service';
import {ItemHttpService} from '../../../shared/service/http/item-http.service';
import {Router, ActivatedRoute} from '@angular/router';
import {AppProperties} from '../../../shared/domain/app-properties';
import {ItemManager} from '../../../shared/utils/item.manager';
import { RboCodeService } from '../../../shared/service/rbo-code.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {
  @Input('show') show: { isShow: boolean };
  @Input('item') item: Item;
  @Input('multipleFieldsOrder') multipleFieldsOrder: string[] = [];
  @Input('fieldConfigs') fieldConfigs;
  @Output('onReloadData') onReloadData = new EventEmitter<Item>();
  @Output('onDeletedItem') onDeletedItem = new EventEmitter<Item>();

  
  itemFieldsHolder: ItemFieldsHolder;
  itemNumber: string;

  constructor(
    private fieldService: FieldService,
    private progressBarService: ProgressBarService,
    private itemHttpService: ItemHttpService,
    private router: Router,
    private rboCodeService: RboCodeService
  ) {
  }

  ngOnInit() {
    this.itemFieldsHolder = new ItemFieldsHolder(this.item, this.fieldConfigs, this.multipleFieldsOrder);
    this.itemNumber = ItemManager.getItemFieldValue(this.item, AppProperties.FIELD_D2COMM_ITEM_NUMBER);
  }

  onShow() {
    this.show.isShow = !this.show.isShow;
  }

  onChoseFields(fieldConfigNames: string[]) {
    this.itemFieldsHolder.createNewItemFields(fieldConfigNames);
  }

  reloadData() {
    this.onReloadData.emit();
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

  onCopyClick() {
    this.router.navigate(['/items/new', {id: this.item.id, rbo: this.rboCodeService.getCurrentCode()}]);
  }

  onGoItemFieldConfig() {
    this.router.navigate(['/item-field-config', this.item.id, this.rboCodeService.getRboObject()]);
  }

  goToMandatoryData() {
    this.router.navigate(['/mandatory-data', this.item.id, this.rboCodeService.getRboObject()]);  
  }

}
