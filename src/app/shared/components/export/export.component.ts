import { Component, OnInit } from '@angular/core';
import { ExportHttpService } from '../../service/http/export.http.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {

  constructor(
    private exportService: ExportHttpService
  ) { }

  ngOnInit() {
  }

  exportAll() {
    this.exportService.exportAll();
  }

}
