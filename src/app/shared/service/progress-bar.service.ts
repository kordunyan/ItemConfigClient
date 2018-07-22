import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class ProgressBarService {
    
    public isShown: boolean = false;

    public show() {
        this.isShown = true;
    }

    public hide() {
        this.isShown = false;
    }

}