import { Component, OnInit } from '@angular/core';
import { ItemHttpService } from '../../../shared/service/http/item-http.service';
import { Observable } from 'rxjs';
import { ProgressBarService } from '../../../shared/service/progress-bar.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {

  private items: string[];

  constructor(
    private itemService: ItemHttpService,
    private progressBarService: ProgressBarService
  ) { }

  ngOnInit() {
    this.progressBarService.show();
    this.itemService.getAllItemValues().subscribe((numbers: string[]) => {
      this.items = numbers;
      this.progressBarService.hide();
    });
  }

  onDeleteItemNumber(itemNumber: string) {
    this.progressBarService.show();
    this.itemService.deleteByItemNumber(itemNumber).subscribe(
      (result) => {
        this.progressBarService.hide();
        this.items = this.items.filter(i => i !== itemNumber);
      }, 
      (error) => this.progressBarService.hide()
    );
  }

}
