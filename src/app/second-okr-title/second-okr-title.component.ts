import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SecondOkr } from '../interfaces/second-okr';
import { AuthService } from '../services/auth.service';
import { OkrService } from '../services/okr.service';

@Component({
  selector: 'app-second-okr-title',
  templateUrl: './second-okr-title.component.html',
  styleUrls: ['./second-okr-title.component.scss'],
})
export class SecondOkrTitleComponent implements OnInit {
  private secondOkrId = this.route.snapshot.queryParamMap.get('v');
  secondOkr$: Observable<SecondOkr> = this.okrService.getSecondOkr(
    this.secondOkrId
  );

  constructor(private route: ActivatedRoute, public okrService: OkrService) {}

  ngOnInit(): void {}
}
