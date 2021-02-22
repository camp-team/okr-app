import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SecondOkr } from 'src/app/interfaces/second-okr';
import { OkrService } from 'src/app/services/okr.service';

@Component({
  selector: 'app-okr-achievement',
  templateUrl: './okr-achievement.component.html',
  styleUrls: ['./okr-achievement.component.scss'],
})
export class OkrAchievementComponent implements OnInit {
  secondOkrs$: Observable<SecondOkr[]> = this.okrService.getSecondOkrs();

  constructor(public okrService: OkrService) {}

  ngOnInit(): void {}
}
