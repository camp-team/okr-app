import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Okr } from '../interfaces/okr';
import { OkrService } from '../services/okr.service';

@Component({
  selector: 'app-home-detail-title',
  templateUrl: './home-detail-title.component.html',
  styleUrls: ['./home-detail-title.component.scss'],
})
export class HomeDetailTitleComponent implements OnInit {
  private okrId = this.route.snapshot.queryParamMap.get('v');
  okr$: Observable<Okr> = this.okrService.getOkr(this.okrId);

  constructor(private route: ActivatedRoute, public okrService: OkrService) {}

  ngOnInit(): void {}
}
