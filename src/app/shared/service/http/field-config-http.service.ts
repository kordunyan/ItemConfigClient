import {AbstractHttpService} from './abstract.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {FieldConfig} from '../../domain/field-config';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {MessageService} from '../message.service';
import { RboCodeService } from '../rbo-code.service';

@Injectable({
  providedIn: 'root',
})
export class FieldConfigHttpService extends AbstractHttpService {

  private static BASE_PATH = '/field_config';

  constructor(http: HttpClient, messageService: MessageService, rboCodeService: RboCodeService) {
    super(http, messageService, rboCodeService, FieldConfigHttpService.BASE_PATH);
  }

  getByOwner(owner: string): Observable<FieldConfig[]> {
    return this.http.get<FieldConfig[]>(this.getRelatedUrl(`/owner/${owner}`), this.getHttpOptions())
      .pipe(
        catchError(this.handleError(`Failed to get field configs by owner: ${owner}`, []))
      );
  }

  getByOwnerMap(owner: string) {
    return this.http.get<FieldConfig[]>(this.getRelatedUrl(`/owner/${owner}/map`), this.getHttpOptions())
      .pipe(
        catchError(this.handleError(`Failed to get field configs by owner: ${owner}`, []))
      );
  }

  getInstructionsFields() {
    return this.http.get<any>(this.getRelatedUrl('/instructions/fields'), this.getHttpOptions())
      .pipe(
        catchError(this.handleError('Failed to load instructions fields', {}))
      );
  }

  getAll(): Observable<FieldConfig[]> {
    return this.http.get<FieldConfig[]>(this.getRelatedUrl('/all'), this.getHttpOptions())
      .pipe(
        catchError(this.handleError(`Failed to get all field configs`, []))
      );
  }
}
