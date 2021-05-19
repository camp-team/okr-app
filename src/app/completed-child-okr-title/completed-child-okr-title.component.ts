import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ChildOkr } from '../interfaces/child-okr';
import { AuthService } from '../services/auth.service';
import { OkrService } from '../services/okr.service';

@Component({
  selector: 'app-completed-child-okr-title',
  templateUrl: './completed-child-okr-title.component.html',
  styleUrls: ['./completed-child-okr-title.component.scss'],
})
export class CompletedChildOkrTitleComponent implements OnInit {
  private secondOkrId = this.route.snapshot.queryParamMap.get('id');
  secondOkr$: Observable<ChildOkr> = this.okrService.getChildOkr(
    this.secondOkrId
  );

  constructor(
    private route: ActivatedRoute,
    public okrService: OkrService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {}
}
