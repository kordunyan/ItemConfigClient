import {AbstractHttpService} from './abstract.service';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {MessageService} from '../message.service';
import {ItemFieldConfig} from '../../domain/item-field-config';
import {SaveItemFieldConfigDto} from '../../dto/save-item-field-config.dto';
import {ItemWithItemFieldConfigDto} from '../../dto/item-with-item-field-config.dto';

@Injectable({
  providedIn: 'root',
})
export class ItemFieldConfigHttpService extends AbstractHttpService {

  private static BASE_PATH = '/item_field_config';

  constructor(http: HttpClient, messageService: MessageService) {
    super(http, messageService, ItemFieldConfigHttpService.BASE_PATH);
  }

  public save(saveItemFieldConfigDto: SaveItemFieldConfigDto): Observable<any> {
    return this.http.post(this.getRelatedUrl('/save'), saveItemFieldConfigDto, this.getHttpOptions())
      .pipe(
        catchError(this.handleTrowableError(`Failed save to item field configs`, saveItemFieldConfigDto))
      );
  }

  public delete(itemWithItemFieldConfigs: ItemWithItemFieldConfigDto): Observable<any> {
    return this.http.post(this.getRelatedUrl('/delete'), itemWithItemFieldConfigs, this.getHttpOptions())
      .pipe(
        catchError(this.handleTrowableError(`Failed delete item fields configs`, itemWithItemFieldConfigs))
      );
  }

  public deleteForAll(itemWithItemFieldConfigs: ItemWithItemFieldConfigDto): Observable<any> {
    return this.http.post(this.getRelatedUrl('/deleteForAll'), itemWithItemFieldConfigs, this.getHttpOptions())
      .pipe(
        catchError(this.handleTrowableError(`Failed delete item fields configs for all items`, itemWithItemFieldConfigs))
      );
  }
}
