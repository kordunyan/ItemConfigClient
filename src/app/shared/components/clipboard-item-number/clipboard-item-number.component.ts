import {Component, Input} from '@angular/core';
import {DocumentUtils} from '../../utils/document-utils';
import {MessageService} from '../../service/message.service';

@Component({
  selector: 'app-clipboard-item-number',
  templateUrl: './clipboard-item-number.component.html',
  styleUrls: ['./clipboard-item-number.component.css']
})
export class ClipboardItemNumberComponent {

  @Input('itemNumber') itemNumber;

  constructor(
    private messageService: MessageService
  ) {
  }

  clipboard() {
    if (DocumentUtils.clipboard(this.itemNumber)) {
      this.messageService.info(`Copied: ${this.itemNumber}`);
    }
  }
}
