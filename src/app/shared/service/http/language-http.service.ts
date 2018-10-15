import { Injectable } from "@angular/core";
import { AbstractHttpService } from "./abstract.service";
import {HttpClient} from '@angular/common/http';
import {MessageService} from '../message.service';
import { RboCodeService } from '../rbo-code.service';
import { Observable } from "rxjs";
import { Language } from "../../domain/language";
import {catchError, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class LanguageHttpService extends AbstractHttpService {
    private static BASE_PATH = '/language';

    constructor(http: HttpClient, messageService: MessageService, rboCodeService: RboCodeService) {
        super(http, messageService, rboCodeService, LanguageHttpService.BASE_PATH);
    }

    public getAll(): Observable<Language[]> {
        return this.http.get<Language[]>(this.getRelatedUrl('/all'), this.getHttpOptions())
            .pipe(
                catchError(this.handleError('Failed get all languages: ', []))
            );
    }

}