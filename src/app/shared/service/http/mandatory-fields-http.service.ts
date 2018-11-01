import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MessageService} from '../message.service';
import {RboCodeService} from '../rbo-code.service';
import {AbstractHttpService} from './abstract.service';
import {SaveMandatoryDataDto} from '../../dto/save-mandatory-data.dto';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import { DeleteMandatoryDataDto } from '../../dto/delete-mandatory-data.dto';

@Injectable({
  providedIn: 'root',
})
export class MandatoryFieldsHttpService extends AbstractHttpService {
  private static BASE_PATH = '/mandatory/field';

  constructor(http: HttpClient, messageService: MessageService, rboCodeService: RboCodeService) {
    super(http, messageService, rboCodeService, MandatoryFieldsHttpService.BASE_PATH);
  }

  public save(dto: SaveMandatoryDataDto): Observable<any> {
    return this.http.post(this.getRelatedUrl('/save'), dto, this.getHttpOptions())
      .pipe(
        catchError(this.handleTrowableError('Failed to save mandatory fields', dto))
      );
  }

  public delete(dto: DeleteMandatoryDataDto): Observable<any> {
    return this.http.post(this.getRelatedUrl('/delete'), dto, this.getHttpOptions())
      .pipe(
        catchError(this.handleTrowableError('Failed to delete mandatory fields', dto))  
      );
  }
}
