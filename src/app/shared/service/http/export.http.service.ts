import {AbstractHttpService} from './abstract.service';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MessageService} from '../message.service';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Header} from '../../domain/header';
import {RboCodeService} from '../rbo-code.service';
import {ExprotFieldConfigDto} from '../../dto/export-field-config.dto';

@Injectable({
  providedIn: 'root',
})
export class ExportHttpService extends AbstractHttpService {
  private static BASE_PATH = '/export';

  constructor(http: HttpClient, messageService: MessageService, rboCodeService: RboCodeService) {
    super(http, messageService, rboCodeService, ExportHttpService.BASE_PATH);
  }

  exportAll(): Observable<any> {
    return this.http.get(this.getRelatedUrl('/generate'), {
      responseType: 'blob',
      observe: 'response',
      headers: this.getHeaders()
    })
      .pipe(
        map(response => {
          return {
            fileData: response.body,
            fileName: response.headers.get(Header.FILENAME)
          };
        }),
        catchError(this.handleTrowableError(`Failed to export all items`))
      );
  }

  exportByItemNumbers(itemNumbers: string[]): Observable<any> {
    return this.http.post(this.getRelatedUrl('/generateby'), itemNumbers, {
      responseType: 'blob',
      observe: 'response',
      headers: this.getHeaders()
    })
      .pipe(
        map(response => {
          return {
            fileData: response.body,
            fileName: response.headers.get(Header.FILENAME)
          };
        }),
        catchError(this.handleTrowableError(`Failed to export items`, itemNumbers))
      );
  }

  exportFieldConfigs(dto: ExprotFieldConfigDto): Observable<any> {
    return this.http.post(this.getRelatedUrl('/field-configs'), dto, {
      responseType: 'blob',
      observe: 'response',
      headers: this.getHeaders()
    })
      .pipe(
        map(response => {
          return {
            fileData: response.body,
            fileName: response.headers.get(Header.FILENAME)
          };
        }),
        catchError(this.handleTrowableError(`Failed export field configs`, dto))
      );
  }

}
