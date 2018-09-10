import {Component, HostListener, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.css']
})
export class ScrollTopComponent implements OnInit {

  @Input('positionToDisplay') positionToDisplay = 200;

  displayScrollTopButton = false;

  constructor() {
  }

  ngOnInit() {
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    if (!this.displayScrollTopButton && scrollTop > this.positionToDisplay) {
      this.displayScrollTopButton = true;
    } else if (this.displayScrollTopButton && scrollTop < this.positionToDisplay) {
      this.displayScrollTopButton = false;
    }
  }

  onScrollTopClick() {
    window.scrollTo(0, 0);
  }

}
