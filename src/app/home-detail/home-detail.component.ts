import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Okr } from '../interfaces/okr';
import { OkrService } from '../services/okr.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home-detail',
  templateUrl: './home-detail.component.html',
  styleUrls: ['./home-detail.component.scss'],
})
export class HomeDetailComponent implements OnInit {
  okr$: Observable<Okr>;

  constructor(private route: ActivatedRoute, public okrService: OkrService) {}

  ngOnInit() {
    this.okr$ = this.route.paramMap.pipe(
      switchMap((map) => {
        const id = map.get('id');
        return this.okrService.getOkr(id);
      })
    );
  }
}
