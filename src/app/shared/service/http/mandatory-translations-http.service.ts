import {AbstractHttpService} from './abstract.service';
import {HttpClient} from '@angular/common/http';
import {MessageService} from '../message.service';
import {RboCodeService} from '../rbo-code.service';
import {SaveMandatoryDataDto} from '../../dto/save-mandatory-data.dto';
import {MandatoryTranslation} from '../../domain/mandatory-translation';
import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MandatoryTranslationsHttpService extends AbstractHttpService {
  private static BASE_PATH = '/mandatory/translation';

  constructor(http: HttpClient, messageService: MessageService, rboCodeService: RboCodeService) {
    super(http, messageService, rboCodeService, MandatoryTranslationsHttpService.BASE_PATH);
  }

  public save(saveDto: SaveMandatoryDataDto): Observable<any> {
    return this.http.post<MandatoryTranslation[]>(this.getRelatedUrl('/save'), saveDto, this.getHttpOptions())
      .pipe(
        catchError(this.handleTrowableError('Failed to save new mandatory translations', saveDto))
      );
  }

}
