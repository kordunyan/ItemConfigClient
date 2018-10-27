import { Injectable } from "@angular/core";
import { AbstractHttpService } from "./abstract.service";
import { HttpClient } from "@angular/common/http";
import { MessageService } from "../message.service";
import { RboCodeService } from "../rbo-code.service";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
    providedIn: 'root',
})
export class InstructionTypeInputConfigHttpService extends AbstractHttpService {

    private static BASE_PATH = '/instruction-input-config';

    constructor(http: HttpClient, messageService: MessageService, rboCodeService: RboCodeService) {
        super(http, messageService, rboCodeService, InstructionTypeInputConfigHttpService.BASE_PATH);
    }

    public getInstructionsLanguages(): Observable<{}> {
        return this.http.get<{}>(this.getRelatedUrl('/instructions-languages'), this.getHttpOptions())
            .pipe(
                catchError(this.handleError('Failed to retrieve instructions languages', {}))
            );
    }

}