import { AbstractHttpService } from "./abstract.service";
import { Injectable } from '@angular/core';
import { MessageService } from "../message.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Field } from "../../domain/field";
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from "rxjs";
import { NewFieldsDTO } from "../../dto/new-fields.dto";
import { FieldForAllItemsDto } from "../../dto/field-for-all-items.dto";
import { ItemFieldCrudOperationsDto } from "../../dto/item-field-crud-operations.dto";

@Injectable({
    providedIn: 'root',
})
export class FieldHttpService extends AbstractHttpService {

    private static BASE_PATH = '/field';

    constructor(http: HttpClient, messageService: MessageService) {
        super(http, messageService, FieldHttpService.BASE_PATH);
    }

    update(field: Field): Observable<any> {
        return this.http.post(this.getRelatedUrl('/update'), field, this.getHttpOptions())
            .pipe(
                catchError(this.handleTrowableError('Failed to update field', field))
            );
    }

    updateAllForItem(field: Field): Observable<any> {
        return this.http.post(this.getRelatedUrl('/updateAll'), field, this.getHttpOptions())
            .pipe(
                catchError(this.handleTrowableError('Failed to update field', field))
            );
    }

    saveAll(fields: Field[]): Observable<any> {
        return this.http.post(this.getRelatedUrl('/save-all'), fields, this.getHttpOptions())
            .pipe(
                catchError(this.handleTrowableError('Failed to save all fields', fields))    
            );
    }

    saveNewFieldsForAllItems(fieldsForAllItems: FieldForAllItemsDto[]): Observable<any> {
        return this.http.post(this.getRelatedUrl('/save-for-all-items'), fieldsForAllItems, this.getHttpOptions())
            .pipe(
                catchError(this.handleTrowableError('Failed to save all fields for all items', fieldsForAllItems))    
            );
    }

    delete(field:Field) {
        return this.http.post(this.getRelatedUrl('/delete'), field, this.getHttpOptions())
            .pipe(
                catchError(this.handleTrowableError('Failed to delete field', field))        
            );
    }

    deleteForALlItems(field: Field) {
        return this.http.post(this.getRelatedUrl('/delete-for-all-items'), field, this.getHttpOptions())
            .pipe(
                catchError(this.handleTrowableError('Failed to delete field for all items', field))
            );
    }

    newSaveFields(dto: ItemFieldCrudOperationsDto) {
        return this.http.post(this.getRelatedUrl('/saveall'), dto, this.getHttpOptions())
            .pipe(
                catchError(this.handleTrowableError('Failed to save all fields for all items', dto))    
            );    
    }

}