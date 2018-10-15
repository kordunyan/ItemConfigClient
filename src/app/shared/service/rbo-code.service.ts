import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class RboCodeService {

    private currentCode: string;
    private rboObject: {rbo: string};

    public changeCode = new BehaviorSubject<string>(null);

    public changeCodeIfNotEquals(newCode) {
        if (newCode !== this.currentCode) {
            this.currentCode = newCode;
            this.rboObject = { rbo: newCode };
            this.changeCode.next(this.currentCode);
        }
    }

    public getCurrentCode(): string {
        return this.currentCode;
    }

    public getRboObject() {
        return this.rboObject;
    }

}
