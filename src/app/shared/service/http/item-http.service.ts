import { AbstractHttpService } from "./abstract.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable, of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from "../message.service";
import { Item } from "../../domain/item";

@Injectable({
    providedIn: 'root',
})
export class ItemHttpService extends AbstractHttpService {

    private static BASE_PATH = '/item';

    constructor(http: HttpClient, messageService: MessageService) {
        super(http, messageService, ItemHttpService.BASE_PATH);
    }

    public save(item: Item): Observable<any> {
        return this.http.post(this.getRelatedUrl(), item, this.getHttpOptions())
            .pipe(
                catchError(this.handleError(`Failed to save new iten: ${item}`, false))
            );
    }

    public saveAll(items: Item[]): Observable<any> {
        return this.http.post(this.getRelatedUrl('/save-all'), items, this.getHttpOptions())
            .pipe(
                catchError(this.handleTrowableError('Failed to save all items', [items]))
            );
    }

    public getAllItemValues():Observable<string[]> {
        return this.http.get<string[]>(this.getRelatedUrl('/numbers'))
            .pipe(
                catchError(this.handleError('Failed to retrieve all items value', []))
            );
    }

    public getItemsByNumber(itemNumber: string): Observable<Item[]> {
        return this.http.get<Item[]>(this.getRelatedUrl(`/number/${itemNumber}`))
            .pipe(
                catchError(this.handleError(`Failed to get items by number: ${itemNumber}`, []))
            );
    }

    public updateLocationEnablemend(item: Item) {
        return this.http.post(this.getRelatedUrl('/update-location'), item, this.getHttpOptions())
            .pipe(
                catchError(this.handleTrowableError('Failed to update item', item))   
            );
    }

    public updateLocationEnablemendAll(item: Item) {
        return this.http.post(this.getRelatedUrl('/update-location-all'), item, this.getHttpOptions())
            .pipe(
                catchError(this.handleTrowableError('Failed to update location enablemend for all items', item))   
            );
    }

    public delete(item: Item) {
        return this.http.post(this.getRelatedUrl('/delete'), item, this.getHttpOptions())
            .pipe(
                catchError(this.handleTrowableError('Failed delete item', item))       
            );
    }

    public deleteByItemNumber(itemNumber: string) {
        return this.http.delete(this.getRelatedUrl(`/number/${itemNumber}`))
            .pipe(
                catchError(this.handleTrowableError(`Failed delete item: ${itemNumber}`, itemNumber))
            );
    }

    public getById(id: string) {
        if (id === null) {
            return of(null);
        }
        return this.http.get(this.getRelatedUrl(`/id/${id}`)).pipe(
            catchError(this.handleError(`Failed to get item by id: ${id}`, null))
        );
    }

}