import {AbstractHttpService} from './abstract.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {MessageService} from '../message.service';
import {Item} from '../../domain/item';
import {CopyItemDto} from '../../dto/copy-iten.dto';
import {UpdateLocationDto} from '../../dto/update-location.dto';
import {RboCodeService} from '../rbo-code.service';

@Injectable({
  providedIn: 'root',
})
export class ItemHttpService extends AbstractHttpService {

  private static BASE_PATH = '/item';

  constructor(http: HttpClient, messageService: MessageService, rboCodeService: RboCodeService) {
    super(http, messageService, rboCodeService, ItemHttpService.BASE_PATH);
  }

  public save(item: Item): Observable<any> {
    return this.http.post(this.getRelatedUrl(), item, this.getHttpOptions())
      .pipe(
        catchError(this.handleError(`Failed to save new iten: ${item}`, false))
      );
  }

  public saveAll(items: Item[]): Observable<any> {
    return this.http.post(this.getRelatedUrl('/save-all'), items, this.getHttpOptions())
      .pipe(
        catchError(this.handleTrowableError('Failed to save all items', [items]))
      );
  }

  public copyAll(copyItemDto: CopyItemDto) {
    return this.http.post(this.getRelatedUrl('/copy-all'), copyItemDto, this.getHttpOptions())
      .pipe(
        catchError(this.handleTrowableError('Failed to copy all items', copyItemDto))
      );
  }

  public getAllItemValues(): Observable<string[]> {
    return this.http.get<string[]>(this.getRelatedUrl('/numbers'), this.getHttpOptions())
      .pipe(
        catchError(this.handleError('Failed to retrieve all items value', []))
      );
  }

  public getItemsByNumber(itemNumber: string): Observable<Item[]> {
    return this.http.get<Item[]>(this.getRelatedUrl(`/number/${itemNumber}`), this.getHttpOptions())
      .pipe(
        catchError(this.handleError(`Failed to get items by number: ${itemNumber}`, []))
      );
  }

  public updateLocationEnablemend(item: Item) {
    return this.http.post(this.getRelatedUrl('/update-location'), item, this.getHttpOptions())
      .pipe(
        catchError(this.handleTrowableError('Failed to update item', item))
      );
  }

  public updateLocationEnablemendAll(dto: UpdateLocationDto) {
    return this.http.post(this.getRelatedUrl('/update-location-all'), dto, this.getHttpOptions())
      .pipe(
        catchError(this.handleTrowableError('Failed to update location enablemend for all items', dto))
      );
  }

  public delete(item: Item) {
    return this.http.post(this.getRelatedUrl('/delete'), item, this.getHttpOptions())
      .pipe(
        catchError(this.handleTrowableError('Failed delete item', item))
      );
  }

  public deleteByItemNumber(itemNumber: string) {
    return this.http.delete(this.getRelatedUrl(`/number/${itemNumber}`), this.getHttpOptions())
      .pipe(
        catchError(this.handleTrowableError(`Failed delete item: ${itemNumber}`, itemNumber))
      );
  }

  public getById(id: string) {
    if (id === null) {
      return of(null);
    }
    return this.http.get(this.getRelatedUrl(`/id/${id}`), this.getHttpOptions())
      .pipe(
        catchError(this.handleError(`Failed to get item by id: ${id}`, null))
      );
  }

  public getByIdWithoutItemFieldConfig(id: string): Observable<Item> {
    if (id === null) {
      return of(null);
    }
    return this.http.get<Item>(this.getRelatedUrl(`/without-field-configs/id/${id}`), this.getHttpOptions())
      .pipe(
        catchError(this.handleError(`Failed to get item by id: ${id}`, null))
      );
  }

  public getByIdNoMandatory(id: string) {
    if (id === null) {
      return of(null);
    }
    return this.http.get(this.getRelatedUrl(`/nomandatory/id/${id}`), this.getHttpOptions())
      .pipe(
        catchError(this.handleError(`Failed to get item by id: ${id}`, null))
      );
  }

}
