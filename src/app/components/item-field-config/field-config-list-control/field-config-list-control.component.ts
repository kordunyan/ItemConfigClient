import {Component, OnInit, Output, Input, EventEmitter} from '@angular/core';
import {Item} from '../../../shared/domain/item';
import {Router} from '@angular/router';
import {ItemManager} from '../../../shared/utils/item.manager';
import {AppProperties} from '../../../shared/domain/app-properties';
import {ItemFieldConfigHolder} from '../../../shared/utils/item-field-config-holder';
import {ItemFieldConfigHttpService} from '../../../shared/service/http/item-field-config-http.service';
import {ProgressBarService} from '../../../shared/service/progress-bar.service';
import {MatDialog} from '@angular/material';
import {MessageService} from '../../../shared/service/message.service';
import {ItemCrudOperationsDto} from '../../../shared/dto/item-crud-operations.dto';
import {ItemFieldConfig} from '../../../shared/domain/item-field-config';
import {MultipleEditDialogComponent} from '../multiple-edit-dialog/multiple-edit-dialog.component';
import {RboCodeService} from '../../../shared/service/rbo-code.service';
import {FieldConfig} from 'src/app/shared/domain/field-config';
import {ItemFieldsCriteria} from '../../../shared/dto/item-fields-criteria.dto';


@Component({
  selector: 'app-field-config-list-control',
  templateUrl: './field-config-list-control.component.html',
  styleUrls: ['./field-config-list-control.component.css']
})
export class FieldConfigListControlComponent implements OnInit {

  @Input('itemFieldConfigHolder') itemFieldConfigHolder: ItemFieldConfigHolder;
  @Output('onReset') onReset = new EventEmitter();
  @Output('onItemFieldConfigChanged') onItemFieldConfigChanged = new EventEmitter();

  filterType: string;
  itemNumber: string;

  constructor(
    private router: Router,
    private itemFieldConfigHttpService: ItemFieldConfigHttpService,
    private progressBarService: ProgressBarService,
    public dialog: MatDialog,
    private messageService: MessageService,
    private rboCodeService: RboCodeService
  ) {
  }

  ngOnInit() {
    this.itemNumber = this.getCurrentItemNumber();
    this.filterType = this.itemFieldConfigHolder.itemFieldConfigFilter.filterType;
  }

  filterChanged() {
    this.itemFieldConfigHolder.itemFieldConfigFilter.changeFilterType(this.filterType);
  }

  onResetClick() {
    this.onReset.emit();
  }

  onAddNewFields(fieldConfigs: FieldConfig[]) {
    this.itemFieldConfigHolder.createNewItemFieldConfigs(fieldConfigs);
  }

  getCurrentItemNumber() {
    return ItemManager.getItemNumber(this.itemFieldConfigHolder.item);
  }

  onSaveAllForItem(saveOptions: any) {
    this.saveItemFieldConfig(true, saveOptions.fieldsCriteria, saveOptions.itemNumbers);
  }

  onSaveClick() {
    this.saveItemFieldConfig(false);
  }

  private buildCrudOperationsDto(itemFieldConfigs: ItemFieldConfig[], forAll: boolean, selectedItemNumbers?: string[], itemFieldsCriteria?: ItemFieldsCriteria): ItemCrudOperationsDto {
    let itemNumbers = [this.getCurrentItemNumber()];
    if (selectedItemNumbers && selectedItemNumbers.length > 0) {
      itemNumbers = itemNumbers.concat(selectedItemNumbers);
    }
    return new ItemCrudOperationsDto(
      Item.copyWithoutFieldConfigs(this.itemFieldConfigHolder.item),
      itemNumbers,
      itemFieldConfigs,
      forAll,
      itemFieldsCriteria
    );
  }

  delete(options?: any) {
    const itemFieldConfigs = this.itemFieldConfigHolder.getSelectedNoNewItemFieldConfigs();
    if (itemFieldConfigs.length === 0) {
      return;
    }
    const itemNumbers = options ? options.itemNumbers : undefined;
    const fieldsCriteria = options ? options.fieldsCriteria : undefined;
    this.progressBarService.show();
    this.itemFieldConfigHttpService.delete(this.buildCrudOperationsDto(itemFieldConfigs, !!options, itemNumbers, fieldsCriteria))
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

  private saveItemFieldConfig(saveForAll: boolean, itemFieldsCriteria?: ItemFieldsCriteria, selectedItemNumbers?: string[]) {
    let changedItemFields = this.itemFieldConfigHolder.getChangedItemFields();
    if (changedItemFields == null || changedItemFields.length === 0) {
      return;
    }

    let itemNumbers = [this.getCurrentItemNumber()];
    if (selectedItemNumbers && selectedItemNumbers.length > 0) {
      itemNumbers = itemNumbers.concat(selectedItemNumbers);
    }

    this.progressBarService.show();
    const saveItemFieldConfigDto = new ItemCrudOperationsDto(
      Item.copyWithoutFieldConfigs(this.itemFieldConfigHolder.item),
      itemNumbers,
      changedItemFields,
      saveForAll,
      itemFieldsCriteria
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

  openMultipleEditDialog() {
    this.dialog.open(MultipleEditDialogComponent, {
      width: '1300px',
      data: {
        itemFieldConfigs: this.itemFieldConfigHolder.item.itemFieldConfigs,
        instructionsFields: this.itemFieldConfigHolder.instructionsFields
      }
    });
  }

  goToMandatoryFields() {
    this.router.navigate(['/mandatory-data', this.itemFieldConfigHolder.item.id, this.rboCodeService.getRboObject()]);
  }

  onBackClick() {
    this.router.navigate(['/items', this.itemNumber, this.rboCodeService.getRboObject()]);
  }

}
