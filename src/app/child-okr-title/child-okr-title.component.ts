import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CompleteOkrDialogComponent } from '../complete-child-okr-dialog/complete-child-okr-dialog.component';
import { ChildOkr } from '../interfaces/child-okr';
import { AuthService } from '../services/auth.service';
import { OkrService } from '../services/okr.service';

@Component({
  selector: 'app-child-okr-title',
  templateUrl: './child-okr-title.component.html',
  styleUrls: ['./child-okr-title.component.scss'],
})
export class SecondOkrTitleComponent implements OnInit {
  differenceInDay: number;
  private childOkrId = this.route.snapshot.queryParamMap.get('id');
  childOkr$: Observable<ChildOkr> = this.okrService.getChildOkr(
    this.childOkrId
  );

  constructor(
    private route: ActivatedRoute,
    public okrService: OkrService,
    public authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.differenceInDays();
  }

  differenceInDays() {
    this.childOkr$.pipe(take(1)).subscribe((childOkr) => {
      const nowDate = new Date();
      const endDate = childOkr.end.toDate();
      const differenceInTime = endDate.getTime() - nowDate.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);
      this.differenceInDay = Math.ceil(differenceInDays);
    });
  }

  childOkrComplete() {
    this.dialog.open(CompleteOkrDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      data: { childOkrId: this.childOkrId },
    });
  }
}
