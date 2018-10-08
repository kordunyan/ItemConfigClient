import {Injectable} from '@angular/core';
import {AbstractHttpService} from './abstract.service';
import {HttpClient} from '@angular/common/http';
import {MessageService} from '../message.service';
import { Observable } from 'rxjs';
import { RboDto } from '../../dto/rbo.dto';
import {catchError} from 'rxjs/operators';
import { RboCodeService } from '../rbo-code.service';

@Injectable({
    providedIn: 'root',
})
export class RboHttpService extends AbstractHttpService {
    private static BASE_PATH = '/rbo';

    constructor(http: HttpClient, messageService: MessageService, rboCodeService: RboCodeService) {
        super(http, messageService, rboCodeService, RboHttpService.BASE_PATH);
    }

    public getAllRbos(): Observable<RboDto[]> {
        return this.http.get<RboDto[]>(this.getRelatedUrl('/rbos'))
            .pipe(
                catchError(this.handleError('Failed get all rbos: ', []))
            );
    }

}