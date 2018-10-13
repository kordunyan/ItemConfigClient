import {Component, OnInit} from '@angular/core';
import {RboCodeService} from '../../service/rbo-code.service';
import {RboHttpService} from '../../service/http/rbo-http.service';
import {Observable} from 'rxjs';
import {RboDto} from '../../dto/rbo.dto';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  rboCode: string;
  rbos$: Observable<RboDto[]>;

  constructor(
    private rboCodeService: RboCodeService,
    private rboHttpService: RboHttpService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.rboCode = this.rboCodeService.getCurrentCode();
    this.rbos$ = this.rboHttpService.getAllRbos();
  }

  onChangeRbo() {
    this.router.navigate(['/items', {rbo: this.rboCode}]);
  }

}
