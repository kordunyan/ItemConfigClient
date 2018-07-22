import { Component, OnInit, Input } from '@angular/core';
import { ProgressBarService } from '../../service/progress-bar.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {
  constructor(
    public progressBarService: ProgressBarService
  ) { }

  ngOnInit() {
  }

}
