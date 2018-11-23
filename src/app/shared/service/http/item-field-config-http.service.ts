import {AbstractHttpService} from './abstract.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {MessageService} from '../message.service';
import {ItemFieldConfig} from '../../domain/item-field-config';
import {ItemCrudOperationsDto} from '../../dto/item-crud-operations.dto';
import {RboCodeService} from '../rbo-code.service';

@Injectable({
  providedIn: 'root',
})
export class ItemFieldConfigHttpService extends AbstractHttpService {

  private static BASE_PATH = '/item_field_config';

  constructor(http: HttpClient, messageService: MessageService, rboCodeService: RboCodeService) {
    super(http, messageService, rboCodeService, ItemFieldConfigHttpService.BASE_PATH);
  }

  public save(saveItemFieldConfigDto: ItemCrudOperationsDto): Observable<any> {
    return this.http.post(this.getRelatedUrl('/save'), saveItemFieldConfigDto, this.getHttpOptions())
      .pipe(
        catchError(this.handleTrowableError(`Failed save to item field configs`, saveItemFieldConfigDto))
      );
  }

  public delete(crudOperationsDto: ItemCrudOperationsDto): Observable<any> {
    return this.http.post(this.getRelatedUrl('/delete'), crudOperationsDto, this.getHttpOptions())
      .pipe(
        catchError(this.handleTrowableError(`Failed delete item fields configs`, crudOperationsDto))
      );
  }

  public deleteForAll(crudOperationsDto: ItemCrudOperationsDto): Observable<any> {
    return this.http.post(this.getRelatedUrl('/deleteForAll'), crudOperationsDto, this.getHttpOptions())
      .pipe(
        catchError(this.handleTrowableError(`Failed delete item fields configs for all items`, crudOperationsDto))
      );
  }

  public getInstructionsByItemId(itemId: string): Observable<ItemFieldConfig[]> {
    return this.http.get<ItemFieldConfig[]>(this.getRelatedUrl(`/instructions/${itemId}`), this.getHttpOptions())
      .pipe(
        catchError(this.handleError(`Failed delete item fields configs for all items`, []))
      );
  }
}
