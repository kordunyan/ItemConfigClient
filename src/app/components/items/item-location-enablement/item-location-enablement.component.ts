import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Item } from '../../../shared/domain/item';
import { ItemHttpService } from '../../../shared/service/http/item-http.service';
import { ProgressBarService } from '../../../shared/service/progress-bar.service';
import { MessageService } from '../../../shared/service/message.service';

@Component({
  selector: 'app-item-location-enablement',
  templateUrl: './item-location-enablement.component.html',
  styleUrls: ['./item-location-enablement.component.css']
})
export class ItemLocationEnablementComponent implements OnInit {

  @Input('item') item: Item;
  @Output("onSavedForAllItems") onSavedForAllItems: EventEmitter<any> = new EventEmitter();

  oldConfig: {sb: boolean, ipps: boolean};
  hasChanges: boolean = false;

  constructor(
    private itemHttpService: ItemHttpService,
    private progressBarService: ProgressBarService,
    private messageService: MessageService
  ) { }

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
    this.progressBarService.show();
    this.itemHttpService.updateLocationEnablemendAll(Item.copyWithoutFields(this.item)).subscribe(
      (result) => {
        this.messageService.success(`${result} items were successfully updated`);
        this.onSavedForAllItems.emit(null);
        this.progressBarService.hide();  
      },
      (error) => this.progressBarService.hide()
    );
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
