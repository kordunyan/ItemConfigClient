import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Item} from '../../../shared/domain/item';
import {ItemHttpService} from '../../../shared/service/http/item-http.service';
import {ProgressBarService} from '../../../shared/service/progress-bar.service';
import {MessageService} from '../../../shared/service/message.service';
import {ItemManager} from '../../../shared/utils/item.manager';
import {AppProperties} from '../../../shared/domain/app-properties';
import {DialogService} from '../../../shared/service/dialog.service';
import {UpdateLocationDto} from '../../../shared/dto/update-location.dto';

@Component({
  selector: 'app-item-location-enablement',
  templateUrl: './item-location-enablement.component.html',
  styleUrls: ['./item-location-enablement.component.css']
})
export class ItemLocationEnablementComponent implements OnInit {

  @Input('item') item: Item;
  @Output('onFieldChanged') onFieldChanged = new EventEmitter();

  oldConfig: { sb: boolean, ipps: boolean };
  hasChanges = false;

  constructor(
    private itemHttpService: ItemHttpService,
    private progressBarService: ProgressBarService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {
  }

  ngOnInit() {
    this.setOldConfig();
  }

  onChangeLocation() {
    this.checkLocationChanges();
  }

  onSaveClick() {
    this.progressBarService.show();
    this.itemHttpService.updateLocationEnablemend(Item.copyWithoutFields(this.item)).subscribe(
      (result) => {
        this.setOldConfig();
        this.checkLocationChanges();
        this.progressBarService.hide();
      },
      (error) => {
        this.progressBarService.hide();
      }
    );
  }

  onSaveAllForItem() {
    this.updateLocationEnablemend();
  }

  saveByItemNumbers() {
    this.dialogService.openItemNumberSelectDialog().subscribe((selectedItemNumbers) =>
      this.updateLocationEnablemend(selectedItemNumbers));
  }

  updateLocationEnablemend(selectedItemNumbers?: string[]) {
    let itemNumbers = [ItemManager.getItemFieldValue(this.item, AppProperties.FIELD_D2COMM_ITEM_NUMBER)];
    if (selectedItemNumbers && selectedItemNumbers.length > 0) {
      itemNumbers = itemNumbers.concat(selectedItemNumbers);
    }
    this.progressBarService.show();
    let dto = new UpdateLocationDto(itemNumbers, this.item.ipps, this.item.sb);
    this.itemHttpService.updateLocationEnablemendAll(dto).subscribe((result) => {
      this.progressBarService.hide();
      this.onFieldChanged.emit();
    }, (error) => {
      this.progressBarService.hide();
    });
  }


  checkLocationChanges() {
    this.hasChanges = this.item.sb != this.oldConfig.sb || this.item.ipps != this.oldConfig.ipps;
  }

  setOldConfig() {
    this.oldConfig = {
      sb: this.item.sb,
      ipps: this.item.ipps
    };
  }

  onCancelClick() {
    this.item.ipps = this.oldConfig.ipps;
    this.item.sb = this.oldConfig.sb;
    this.checkLocationChanges();
  }

}
