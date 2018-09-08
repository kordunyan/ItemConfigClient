import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable, of} from 'rxjs';
import { MessageService } from "../message.service";

@Injectable()
export abstract class AbstractHttpService {
    private static API_URL = 'http://localhost:8080/api';
    private static HEADERS = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});

    constructor(
        protected http: HttpClient,
        protected messageService: MessageService,
        protected basePath: string
    ) {
    }

    public getUrl(uri?: string) {
        return uri ? `${AbstractHttpService.API_URL}${uri}` : AbstractHttpService.API_URL; 
    }

    public getRelatedUrl(uri?: string) {
        let relatedUri = uri ? `${this.basePath}${uri}` : this.basePath;
        return this.getUrl(relatedUri);
    }

    public getHeaders() {
        return AbstractHttpService.HEADERS;
    }

    public getHttpOptions() {
        return {
            headers: AbstractHttpService.HEADERS
        };
    }

    protected handleError<T>(errorMesage = 'Error', result?:T) {
        return (error: any): Observable<T> => {
            this.messageService.error(errorMesage);
            console.error(errorMesage, error);
            return of(result as T);
        }
    }

    protected handleTrowableError(errorMesage = 'Error', failedValues?:any) {
        return (error: any) => {
            this.messageService.error(errorMesage);
            console.error(errorMesage, error);
            if (failedValues) {
                console.error(failedValues);
            }
            throw errorMesage;
        }    
    }
}
