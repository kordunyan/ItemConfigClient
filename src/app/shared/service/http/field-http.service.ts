import {AbstractHttpService} from './abstract.service';
import {Injectable} from '@angular/core';
import {MessageService} from '../message.service';
import {HttpClient} from '@angular/common/http';
import {Field} from '../../domain/field';
import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ItemFieldCrudOperationsDto} from '../../dto/item-field-crud-operations.dto';
import { RboCodeService } from '../rbo-code.service';

@Injectable({
  providedIn: 'root',
})
export class FieldHttpService extends AbstractHttpService {

  private static BASE_PATH = '/field';

  constructor(http: HttpClient, messageService: MessageService, rboCodeService: RboCodeService) {
    super(http, messageService, rboCodeService, FieldHttpService.BASE_PATH);
  }

  update(field: Field): Observable<any> {
    return this.http.post(this.getRelatedUrl('/update'), field, this.getHttpOptions())
      .pipe(
        catchError(this.handleTrowableError('Failed to update field', field))
      );
  }

  saveAll(fields: Field[]): Observable<any> {
    return this.http.post(this.getRelatedUrl('/save-all'), fields, this.getHttpOptions())
      .pipe(
        catchError(this.handleTrowableError('Failed to save all fields', fields))
      );
  }

  delete(field: Field) {
    return this.http.post(this.getRelatedUrl('/delete'), field, this.getHttpOptions())
      .pipe(
        catchError(this.handleTrowableError('Failed to delete field', field))
      );
  }

  deleteForALlItems(dto: ItemFieldCrudOperationsDto) {
    return this.http.post(this.getRelatedUrl('/delete-for-items'), dto, this.getHttpOptions())
      .pipe(
        catchError(this.handleTrowableError('Failed to delete field for all items', dto))
      );
  }

  saveForItems(dto: ItemFieldCrudOperationsDto) {
    return this.http.post(this.getRelatedUrl('/save-for-items'), dto, this.getHttpOptions())
      .pipe(
        catchError(this.handleTrowableError('Failed to save all fields for all items', dto))
      );
  }

}
