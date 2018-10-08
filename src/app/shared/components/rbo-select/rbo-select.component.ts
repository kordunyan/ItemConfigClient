import { Component, OnInit } from '@angular/core';
import { RboHttpService } from '../../service/http/rbo-http.service';
import { RboDto } from '../../dto/rbo.dto';
import { ProgressBarService } from '../../service/progress-bar.service';

@Component({
  selector: 'app-rbo-select',
  templateUrl: './rbo-select.component.html',
  styleUrls: ['./rbo-select.component.css']
})
export class RboSelectComponent implements OnInit {

  rbos: RboDto[] = [];

  constructor(
    private progresBarService: ProgressBarService,
    private rboHttpService: RboHttpService
  ) { }

  ngOnInit() {
    this.progresBarService.show();
    this.rboHttpService.getAllRbos().subscribe((rbos: RboDto[]) => {
      this.rbos = rbos;
      this.progresBarService.hide();
    }, (error) => {
      this.progresBarService.hide();
    });
  }

}
