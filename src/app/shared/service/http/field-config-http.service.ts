import {AbstractHttpService} from './abstract.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {FieldConfig} from '../../domain/field-config';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {MessageService} from '../message.service';
import {SaveItemFieldConfigDto} from '../../dto/save-item-field-config.dto';

@Injectable({
  providedIn: 'root',
})
export class FieldConfigHttpService extends AbstractHttpService {

  private static BASE_PATH = '/field_config';

  constructor(http: HttpClient, messageService: MessageService) {
    super(http, messageService, FieldConfigHttpService.BASE_PATH);
  }

  getByOwner(owner: string): Observable<FieldConfig[]> {
    return this.http.get<FieldConfig[]>(this.getRelatedUrl(`/owner/${owner}`))
      .pipe(
        catchError(this.handleError(`Failed to get field configs by owner: ${owner}`, []))
      );
  }

  getByOwnerMap(owner: string) {
    return this.http.get<FieldConfig[]>(this.getRelatedUrl(`/owner/${owner}/map`))
      .pipe(
        catchError(this.handleError(`Failed to get field configs by owner: ${owner}`, []))
      );
  }

  getAll(): Observable<FieldConfig[]> {
    return this.http.get<FieldConfig[]>(this.getRelatedUrl('/all'))
      .pipe(
        catchError(this.handleError(`Failed to get all field configs`, []))
      );
  }

  public save(fieldConfigs: FieldConfig[]): Observable<any> {
    return this.http.post(this.getRelatedUrl('/save-all'), fieldConfigs, this.getHttpOptions())
      .pipe(
        catchError(this.handleTrowableError(`Failed save to field configs`, fieldConfigs))
      );
  }

  public delete(fieldConfig: FieldConfig): Observable<any> {
    return this.http.post(this.getRelatedUrl('/delete'), fieldConfig, this.getHttpOptions())
      .pipe(
        catchError(this.handleTrowableError(`Failed to delete field config`, fieldConfig))
      );
  }
}
