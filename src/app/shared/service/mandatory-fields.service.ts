import {Injectable} from '@angular/core';
import {ProgressBarService} from './progress-bar.service';
import {MessageService} from './message.service';
import {MandatoryFieldsHttpService} from './http/mandatory-fields-http.service';
import {ItemFieldConfig} from '../domain/item-field-config';
import {SaveMandatoryDataDto} from '../dto/save-mandatory-data.dto';
import { DeleteMandatoryDataDto } from '../dto/delete-mandatory-data.dto';
import { AbstractMandatoryDataService } from './abstract-mandatory-data.service';

@Injectable({
  providedIn: 'root',
})
export class MandatoryFieldsService extends AbstractMandatoryDataService{

  constructor(
    progressBarService: ProgressBarService,
    messageService: MessageService,
    private mandatoryFieldsHttpService: MandatoryFieldsHttpService
  ) {
    super(progressBarService, messageService);
  }

  protected _deleteFromServer(dto: DeleteMandatoryDataDto, itemFieldConfigsWithSelectedData: ItemFieldConfig[]) {
    this.progressBarService.show();
    this.mandatoryFieldsHttpService.delete(dto).subscribe(
      result => {
        itemFieldConfigsWithSelectedData.forEach(itemFieldConfig => {
          itemFieldConfig.mandatoryFields = itemFieldConfig.mandatoryFields.filter(field => !field.selected);
        });
        this.messageService.success('Mandatory fields were deleted');
        this.progressBarService.hide();
      }, error => this.progressBarService.hide()
    );
  }

  protected _saveOnServer(dto: SaveMandatoryDataDto, itemFieldConfigsWithNewData: ItemFieldConfig[]) {
    this.progressBarService.show();
    this.mandatoryFieldsHttpService.save(dto).subscribe(
      result => {
        this._replaceItemFieldConfigs(result, itemFieldConfigsWithNewData);
        this.messageService.success('Mandatory fields were saved');
        this.progressBarService.hide();
      }, error => this.progressBarService.hide());
  }

  protected _buildDeleteDto(itemFieldConfigs: ItemFieldConfig[], deleteForAll: boolean, itemNumbers?: string[]): DeleteMandatoryDataDto {
    const fieldsToDeleteByFieldName = {};
    itemFieldConfigs.forEach(itemFieldConfig => {
      fieldsToDeleteByFieldName[itemFieldConfig.fieldConfig.name] = itemFieldConfig.mandatoryFields.filter(field => field.selected);  
    });
    const result = new DeleteMandatoryDataDto(deleteForAll, itemNumbers);
    result.fieldsToDeleteByFieldName = fieldsToDeleteByFieldName;
    return result;
  }

  protected _hasSelectedData(itemFieldConfig: ItemFieldConfig): boolean {
    return itemFieldConfig.mandatoryFields.findIndex(field => field.selected) >= 0;
  }

  protected _hasNewData(itemFieldConfigs: ItemFieldConfig): boolean {
    return itemFieldConfigs.mandatoryFields.findIndex(field => !field.id) >= 0;
  }
}
