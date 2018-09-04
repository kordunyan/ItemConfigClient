import { AbstractHttpService } from './abstract.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { MessageService } from '../message.service';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ExportHttpService extends AbstractHttpService {
    private static BASE_PATH = '/export';

    constructor(http: HttpClient, messageService: MessageService) {
        super(http, messageService, ExportHttpService.BASE_PATH);
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
                 fileName: response.headers.get('Filename')
                };
            }),
            catchError(this.handleTrowableError(`Failed generate report for all items`))
        );
    }

    exportByItemNumbers(itemNumbers: string[]) {
      return this.http.post(this.getRelatedUrl('/generateby'), itemNumbers, {
        responseType: 'blob',
        observe: 'response',
        headers: this.getHeaders()
      })
        .pipe(
          map(response => {
            return {
              fileData: response.body,
              fileName: response.headers.get('Filename')
            };
          }),
          catchError(this.handleTrowableError(`Failed generate report for items`, itemNumbers))
        );
    }

}
