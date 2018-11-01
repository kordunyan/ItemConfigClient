import {Injectable} from '@angular/core';
import {MandatoryTranslationsHttpService} from './http/mandatory-translations-http.service';
import {ItemFieldConfig} from '../domain/item-field-config';
import {SaveMandatoryDataDto} from '../dto/save-mandatory-data.dto';
import {ProgressBarService} from './progress-bar.service';
import {MessageService} from './message.service';
import {DeleteMandatoryDataDto} from '../dto/delete-mandatory-data.dto';
import { AbstractMandatoryDataService } from './abstract-mandatory-data.service';

@Injectable({
  providedIn: 'root',
})
export class MandatoryTranslationsService extends AbstractMandatoryDataService {

  constructor(
    private mandatoryTranslationsHttpService: MandatoryTranslationsHttpService,
    progressBarService: ProgressBarService,
    messageService: MessageService
  ) {
    super(progressBarService, messageService);
  }

  protected _hasSelectedData(itemFieldConfig: ItemFieldConfig): boolean {
    return itemFieldConfig.mandatoryTranslations.findIndex(translation => translation.selected) >= 0;
  }

  protected _hasNewData(itemFieldConfigs: ItemFieldConfig): boolean {
    return itemFieldConfigs.mandatoryTranslations.findIndex(translation => !translation.id) >= 0;
  }

  protected _saveOnServer(dto: SaveMandatoryDataDto, itemFieldConfigsWithNewData: ItemFieldConfig[]) {
    this.progressBarService.show();
    this.mandatoryTranslationsHttpService.save(dto).subscribe(result => {
      this._replaceItemFieldConfigs(result, itemFieldConfigsWithNewData);
      this.messageService.success('Mandatory translations were saved');
      this.progressBarService.hide();
    }, error => this.progressBarService.hide());
  }

  protected _deleteFromServer(dto: DeleteMandatoryDataDto, itemFieldConfigsWithSelectedData: ItemFieldConfig[]) {
    this.progressBarService.show();
    this.mandatoryTranslationsHttpService.delete(dto).subscribe((result) => {
      itemFieldConfigsWithSelectedData.forEach(itemFieldConfig => {
        itemFieldConfig.mandatoryTranslations = itemFieldConfig.mandatoryTranslations.filter(translation => !translation.selected);
      });
      this.messageService.success('Mandatory translations were deleted');
      this.progressBarService.hide();
    }, (error) => this.progressBarService.hide());
  }

  protected _buildDeleteDto(itemFieldConfigs: ItemFieldConfig[], deleteForAll: boolean, itemNumbers?: string[]): DeleteMandatoryDataDto {
    const translationsToDeleteByFieldName = {};
    itemFieldConfigs.forEach(itemFieldConfig => {
      translationsToDeleteByFieldName[itemFieldConfig.fieldConfig.name] =
        itemFieldConfig.mandatoryTranslations.filter(translation => translation.selected);
    });
    const result = new DeleteMandatoryDataDto(deleteForAll, itemNumbers);
    result.translationsToDeleteByFieldName = translationsToDeleteByFieldName;
    return result;
  }

}
