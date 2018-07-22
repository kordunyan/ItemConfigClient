import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'toastr';

@Injectable({
    providedIn: 'root',
})
export class MessageService {

    public messages: string[] = [];

    private messagesSubject = new Subject();
    
    constructor() {
        toastr.options.closeButton = true;
        this.messagesSubject.subscribe((message: Message) => {
            toastr[message.type](message.text);
        });
    }

    private add(message: Message) {
        this.messagesSubject.next(message);
    }

    info(text: string) {
        this.add(new Message(text));
    }

    error(text: string) {
        this.add(new Message(text, Message.TYPE_ERROR));
    }

    success(text: string) {
        this.add(new Message(text, Message.TYPE_SUCCESS));
    }

    warning(text: string) {
        this.add(new Message(text, Message.TYPE_WARNING));
    }
}

class Message {
    static TYPE_SUCCESS = 'success';
    static TYPE_INFO = 'info';
    static TYPE_WARNING = 'warning';
    static TYPE_ERROR = 'error';

    constructor(
        public text: string,
        public type: string = Message.TYPE_INFO
    ) {

    }
}