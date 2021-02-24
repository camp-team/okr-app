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
  secondOkr: boolean;

  constructor(public okrService: OkrService) {}

  ngOnInit(): void {
    this.secondOkrs$.subscribe((secondOkrs) => {
      secondOkrs.map((secondOkr) => {
        if (secondOkrs.length === 0) {
          this.secondOkr = false;
        } else if (secondOkr.isComplete === true) {
          this.secondOkr = false;
        } else if (secondOkr.isComplete === false) {
          this.secondOkr = true;
        }
      });
    });
  }
}
