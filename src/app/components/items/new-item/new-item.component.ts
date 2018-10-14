import {Component, OnInit, Inject} from '@angular/core';
import {MatDialog} from '@angular/material';

import {FieldConfig} from '../../../shared/domain/field-config';
import {Field} from '../../../shared/domain/field';
import {Item} from '../../../shared/domain/item';
import {FieldConfigHttpService} from '../../../shared/service/http/field-config-http.service';
import {ItemHttpService} from '../../../shared/service/http/item-http.service';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {MultipleField} from '../../../shared/domain/multiple-field';
import {MessageService} from '../../../shared/service/message.service';
import {AppProperties} from '../../../shared/domain/app-properties';
import {ProgressBarService} from '../../../shared/service/progress-bar.service';
import {FieldService} from '../../../shared/service/field.service';
import {first, switchMap} from 'rxjs/operators';
import {forkJoin} from 'rxjs';
import {ItemManager} from '../../../shared/utils/item.manager';
import {CopyItemDto} from '../../../shared/dto/copy-iten.dto';
import { RboCodeService } from '../../../shared/service/rbo-code.service';
import { RboHttpService } from '../../../shared/service/http/rbo-http.service';


@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.css']
})
export class NewItemComponent implements OnInit {

  fieldConfigs: FieldConfig[] = [];
  excludedFieldConfigs: FieldConfig[] = [];
  isLoaded = false;
  isSaveProcess = false;
  itemFields: Field[] = [];
  itemMultipleFields: MultipleField[] = [];
  isIpps: boolean = true;
  isSb: boolean = true;
  copyItem: Item;

  constructor(
    private fieldConfigService: FieldConfigHttpService,
    private itemHttpService: ItemHttpService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private progressBarService: ProgressBarService,
    private fieldService: FieldService,
    public rboCodeService: RboCodeService
  ) {
  }

  ngOnInit() {
    this.progressBarService.show();

    forkJoin(
      this.route.paramMap.pipe(
        first(),
        switchMap((params: ParamMap) => this.itemHttpService.getById(params.get('id')))
      ),
      this.fieldConfigService.getByOwner(AppProperties.OWNER_ITEM)
    ).subscribe((result) => {
      // result[0] = copyItem, result[1] = fieldConfigs
      this.copyItem = result[0];
      this.fieldConfigs = result[1];
      
      this.setIppsAndSb();
      this.generateItemFields();
      this.isLoaded = true;
      this.progressBarService.hide();
    });
  }

  setIppsAndSb() {
    if (this.copyItem) {
      this.isIpps = this.copyItem.ipps;
      this.isSb = this.copyItem.sb;
    }
  }

  public generateItemFields() {
    this.fieldConfigs.forEach((fieldConfig: FieldConfig) => {
      if (this.hasCopyItemField(fieldConfig.name)) {
        if (this.fieldService.isMultiple(fieldConfig.name)) {
          this.itemMultipleFields.push(MultipleField.createFromField(this.getCopyItemField(fieldConfig.name)));
        } else {
          this.itemFields.push(Field.copyWithoutIdAndFieldSet(this.getCopyItemField(fieldConfig.name)));
        }
      } else if (this.fieldService.isDefaultExcluded(fieldConfig)) {
        this.excludedFieldConfigs.push(fieldConfig);
      } else {
        this.addItemField(fieldConfig);
      }
    });
  }

  hasCopyItemField(fieldCOnfigName: string) {
    return this.getCopyItemField(fieldCOnfigName) != null;
  }

  getCopyItemField(fieldConfigName: string): Field {
    return ItemManager.getItemField(this.copyItem, fieldConfigName);
  }

  isCopyProcess() {
    return this.copyItem != null;
  }

  onSave() {
    this.progressBarService.show();
    this.isSaveProcess = true;
    if (this.isCopyProcess()) {
      this.copyNewItem();
    } else {
      this.saveNewItem();
    }
  }

  copyNewItem() {
    let copyItemDto = new CopyItemDto(this.createItems(), this.copyItem.id);
    this.itemHttpService.copyAll(copyItemDto).subscribe(() => {
      this.isSaveProcess = false;
      this.progressBarService.hide();
      this.messageService.success('Items has already copyed');
      this.gotToNewItem();
    }, () => {
      this.isSaveProcess = false;
      this.progressBarService.hide();
    });
  }

  getNewItemField(fieldConfigName) {
    return this.itemFields.find(f => f.fieldConfigName === fieldConfigName);
  }

  gotToNewItem() {
    this.router.navigate([
      '/items', 
      this.getNewItemField(AppProperties.FIELD_D2COMM_ITEM_NUMBER).value,
      this.rboCodeService.getRboObject()
    ])
  }

  saveNewItem() {
    this.itemHttpService.saveAll(this.createItems()).subscribe(() => {
      this.isSaveProcess = false;
      this.progressBarService.hide();
      this.messageService.success('Items has already added');
      this.gotToNewItem();
    }, () => {
      this.isSaveProcess = false;
      this.progressBarService.hide();
    });
  }

  createItems(): Item[] {
    let result: Item[] = [];
    let noEmptyFields = this.fieldService.filterEmptyFields(this.itemFields);
    let noEmptyMultipleFields = this.fieldService.filterEmptyMultipleFiels(this.itemMultipleFields);

    if (noEmptyMultipleFields.length) {
      this.createCombinations(noEmptyMultipleFields, [], (combination) => {
        result.push(new Item(this.isIpps, this.isSb, noEmptyFields.concat(combination)));
      });
    } else {
      result.push(new Item(this.isIpps, this.isSb, noEmptyFields));
    }
    return result;
  }

  createCombinations(multipleFields: MultipleField[], combination: Field[], onCombinationCreate) {
    let multipleField = multipleFields.pop();
    multipleField.values.forEach(value => {
      // create copy of combination with new field
      let newCombination: Field[] = [new Field(multipleField.fieldConfigName, value)].concat(combination);
      if (multipleFields.length) {
        // pass copy of multipleFields (slice create a copy of array)
        this.createCombinations(multipleFields.slice(), newCombination, onCombinationCreate);
      } else {
        onCombinationCreate(newCombination);
      }
    });
  }

  addFieldsFromExcluded(fieldConfigNames: string[]) {
    fieldConfigNames.forEach(fieldConfigName => {
      let fieldConfig = this.findExcludedField(fieldConfigName);
      if (fieldConfig) {
        this.addItemField(fieldConfig);
        this.removeFromExludedField(fieldConfig);
      }
    });
  }

  findExcludedField(fieldConfigName): FieldConfig {
    return this.excludedFieldConfigs.find(f => f.name === fieldConfigName);
  }

  removeFromExludedField(fieldConfig: FieldConfig) {
    this.excludedFieldConfigs.splice(this.excludedFieldConfigs.indexOf(fieldConfig), 1);
  }

  addItemField(fieldConfig: FieldConfig) {
    if (this.fieldService.isMultiple(fieldConfig.name)) {
      this.itemMultipleFields.push(new MultipleField(fieldConfig.name, []));
    } else {
      this.itemFields.push(new Field(fieldConfig.name, ''));
    }
  }

  onBackClick() {
    if (this.copyItem) {
      let itemNumberField = this.getCopyItemField(AppProperties.FIELD_D2COMM_ITEM_NUMBER);
      this.router.navigate(['/items', itemNumberField.value, this.rboCodeService.getRboObject()]);
    } else {
      this.router.navigate(['/items', this.rboCodeService.getRboObject()]);
    }
  }

}
