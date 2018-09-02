import { AbstractHttpService } from "./abstract.service";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders  } from "@angular/common/http";
import { MessageService } from "../message.service";
import { FieldConfigHttpService } from "./field-config-http.service";
import { ResponseContentType } from '@angular/http';
import { map } from "rxjs/operators";

@Injectable({
    providedIn: 'root',
})
export class ExportHttpService extends AbstractHttpService {
    private static BASE_PATH = '/export';

    constructor(http: HttpClient, messageService: MessageService) {
        super(http, messageService, ExportHttpService.BASE_PATH);
    }

    exportAll() {
        this.http.get(this.getRelatedUrl('/generate'), {
            responseType: 'blob',
            observe: 'response'
        })
        .pipe(
            map(response => {
                return {
                 fileData: response.body,
                 fileName: response.headers.get('Filename')   
                }
            })
        )
        .subscribe(result => {
            let url = window.URL.createObjectURL(result.fileData);
            let a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = url;
            a.download = result.fileName;
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        });
    }

}