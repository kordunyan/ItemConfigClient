import {Component, OnInit, Output, Input, EventEmitter} from '@angular/core';
import {Item} from '../../../shared/domain/item';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {ItemManager} from '../../../shared/utils/item.manager';
import {AppProperties} from '../../../shared/domain/app-properties';
import {ItemFieldConfigHolder} from '../../../shared/utils/item-field-config-holder';
import {SaveItemFieldConfigDto} from '../../../shared/dto/save-item-field-config.dto';
import {ItemFieldConfigHttpService} from '../../../shared/service/http/item-field-config-http.service';
import {ProgressBarService} from '../../../shared/service/progress-bar.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {SaveForAllDialogComponent} from '../save-for-all-dialog/save-for-all-dialog.component';
import {MessageService} from '../../../shared/service/message.service';
import {DeleteComponent} from '../../../shared/components/delete/delete.component';
import {ItemWithItemFieldConfigDto} from '../../../shared/dto/item-with-item-field-config.dto';
import { ItemCrudOperationsDto } from '../../../shared/dto/item-crud-operations.dto';
import { ItemFieldConfig } from '../../../shared/domain/item-field-config';

@Component({
  selector: 'app-field-config-list-control',
  templateUrl: './field-config-list-control.component.html',
  styleUrls: ['./field-config-list-control.component.css']
})
export class FieldConfigListControlComponent implements OnInit {

  @Input('itemFieldConfigHolder') itemFieldConfigHolder: ItemFieldConfigHolder;
  @Output('onReset') onReset = new EventEmitter();
  @Output('onItemFieldConfigChanged') onItemFieldConfigChanged = new EventEmitter();

  public btnType = DeleteComponent.DELETE_BTN_TYPE_DANGER;

  constructor(
    private router: Router,
    private itemFieldConfigHttpService: ItemFieldConfigHttpService,
    private progressBarService: ProgressBarService,
    public dialog: MatDialog,
    private messageService: MessageService,
  ) {
  }

  ngOnInit() {
  }

  onResetClick() {
    this.onReset.emit();
  }

  onBackClick() {
    const fieldItemNumber = ItemManager.getItemField(this.itemFieldConfigHolder.item, AppProperties.FIELD_D2COMM_ITEM_NUMBER);
    this.router.navigate(['/items', fieldItemNumber.value]);
  }

  onChoseFields(fieldConfigNames: string[]) {
    this.itemFieldConfigHolder.createNewItemFieldConfigs(fieldConfigNames);
  }

  onSaveAllForItem() {
    let dialogRef = this.dialog.open(SaveForAllDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(saveForAllStrategy => {
      if (saveForAllStrategy) {
        this.saveItemFieldConfig(true, saveForAllStrategy);
      }
    });
  }

  onSaveClick() {
    this.saveItemFieldConfig(false);
  }

  onDelete() {
    const itemFieldConfigs = this.itemFieldConfigHolder.getSelectedItemFieldConfigs();
    if (itemFieldConfigs.length === 0) {
      return;
    }  
    this.progressBarService.show();
    this.itemFieldConfigHttpService.delete(this.buildCrudOperationsDto(itemFieldConfigs))
      .subscribe(
        (result) => {
          this.messageService.success('Item field configs have succesfult deleted');
          this.progressBarService.hide();
          this.onItemFieldConfigChanged.emit();
        },
        (error) => {
          this.progressBarService.hide();
          console.error(error);
        }
      );  
  }

  private buildCrudOperationsDto(itemFieldConfigs: ItemFieldConfig[]): ItemCrudOperationsDto{
    return new ItemCrudOperationsDto(
      Item.copyWithoutFieldConfigs(this.itemFieldConfigHolder.item),
      [ItemManager.getItemFieldValue(this.itemFieldConfigHolder.item, AppProperties.FIELD_D2COMM_ITEM_NUMBER)],
      itemFieldConfigs
    )
  }

  onDeleteForAll() {
    const itemFieldConfigs = this.itemFieldConfigHolder.getSelectedItemFieldConfigs();
    if (itemFieldConfigs.length === 0) {
      return;
    }
    this.progressBarService.show();
    this.itemFieldConfigHttpService.deleteForAll(this.buildCrudOperationsDto(itemFieldConfigs))
      .subscribe(
        (result) => {
          this.messageService.success('Item field configs have succesfult deleted for all items');
          this.progressBarService.hide();
          this.onItemFieldConfigChanged.emit();
        },
        (error) => {
          this.progressBarService.hide();
          console.error(error);
        }
      );
  }

  private saveItemFieldConfig(saveForAll: boolean, saveForAllStrategy?: string) {
    let changedItemFields = this.itemFieldConfigHolder.getChangedItemFields();
    if (changedItemFields == null || changedItemFields.length === 0) {
      return;
    }
    this.progressBarService.show();
    let saveItemFieldConfigDto = new SaveItemFieldConfigDto(
      Item.copyWithoutFieldConfigs(this.itemFieldConfigHolder.item),
      [ItemManager.getItemFieldValue(this.itemFieldConfigHolder.item, AppProperties.FIELD_D2COMM_ITEM_NUMBER)],
      changedItemFields,
      saveForAll,
      saveForAllStrategy
    );

    this.itemFieldConfigHttpService.save(saveItemFieldConfigDto).subscribe(
      (result) => {
        this.messageService.success('Item fields configs have been succesfuly updated');
        this.progressBarService.hide();
        this.onItemFieldConfigChanged.emit();
      },
      (error) => {
        this.progressBarService.hide();
        console.error(error);
      }
    );
  }

}
