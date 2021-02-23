import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SecondOkr } from '../interfaces/second-okr';
import { AuthService } from '../services/auth.service';
import { OkrService } from '../services/okr.service';

@Component({
  selector: 'app-complete-okr-title',
  templateUrl: './complete-okr-title.component.html',
  styleUrls: ['./complete-okr-title.component.scss'],
})
export class CompleteOkrTitleComponent implements OnInit {
  private secondOkrId = this.route.snapshot.queryParamMap.get('v');
  secondOkr$: Observable<SecondOkr> = this.okrService.getSecondOkr(
    this.secondOkrId
  );

  constructor(
    private route: ActivatedRoute,
    public okrService: OkrService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {}
}
