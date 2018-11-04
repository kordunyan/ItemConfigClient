import {Component, OnInit} from '@angular/core';
import {ItemHttpService} from '../../../shared/service/http/item-http.service';
import {Observable, of} from 'rxjs';
import {ProgressBarService} from '../../../shared/service/progress-bar.service';
import {ActivatedRoute} from '@angular/router';
import {RboCodeService} from '../../../shared/service/rbo-code.service';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { MessageService } from 'src/app/shared/service/message.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  itemNumberInput = new FormControl();
  public items: string[];
  public filteredItems: Observable<string[]>;

  constructor(
    private itemService: ItemHttpService,
    private progressBarService: ProgressBarService,
    public rboCodeService: RboCodeService,
    private messageService: MessageService
  ) {
  }

  ngOnInit() {
    this.loadItemsValue();
    this.rboCodeService.changeCode.subscribe(result => this.loadItemsValue());
  }

  private loadItemsValue() {
    this.progressBarService.show();
    this.itemService.getAllItemValues().subscribe((numbers: string[]) => {
      this.items = numbers;
      this.initFilter();
      this.progressBarService.hide();
    });
  }

  initFilter() {
    this.filteredItems = this.itemNumberInput.valueChanges.pipe(
      startWith<string>(''),
      map((itemNumber: string) => {
        return itemNumber ? this._filter(itemNumber) : this.items.slice()
      })
    );
  }

  private _filter(itemNumber: string): string[] {
    const inLowerCase = itemNumber.trim().toLowerCase();
    return this.items.filter(item => item.toLocaleLowerCase().indexOf(inLowerCase) >= 0);
  }

  onDeleteItemNumber(itemNumber: string) {
    this.progressBarService.show();
    this.itemService.deleteByItemNumber(itemNumber).subscribe(
      (result) => {
        this.items = this.items.filter(i => i !== itemNumber);
        this.filteredItems = of(this.items);
        this.messageService.success(`Item: '${itemNumber}' were deleted`);
        this.progressBarService.hide();
      },
      (error) => this.progressBarService.hide()
    );
  }

}
