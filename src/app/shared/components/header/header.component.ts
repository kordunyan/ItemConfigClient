import { Component, OnInit } from '@angular/core';
import { RboCodeService } from '../../service/rbo-code.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    public rboCodeService: RboCodeService
  ) { }

  ngOnInit() { 
  }

}
