import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    private route: ActivatedRoute,
    public okrService: OkrService,
    public authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  secondOkrComplete() {
    const secondOkrValue: SecondOkr = {
      isComplete: false,
    };
    this.okrService.updateSecondOkr(
      this.authService.uid,
      this.secondOkrId,
      secondOkrValue
    );
    this.snackBar.open('お疲れ様でした✨', null);
    this.router.navigateByUrl('manage/achieve');
  }
}
