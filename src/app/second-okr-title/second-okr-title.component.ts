import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CompleteOkrDialogComponent } from '../complete-okr-dialog/complete-okr-dialog.component';
import { SecondOkr } from '../interfaces/second-okr';
import { AuthService } from '../services/auth.service';
import { OkrService } from '../services/okr.service';

@Component({
  selector: 'app-second-okr-title',
  templateUrl: './second-okr-title.component.html',
  styleUrls: ['./second-okr-title.component.scss'],
})
export class SecondOkrTitleComponent implements OnInit {
  differenceInDay: number;
  private secondOkrId = this.route.snapshot.queryParamMap.get('v');
  secondOkr$: Observable<SecondOkr> = this.okrService.getSecondOkr(
    this.secondOkrId
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
    this.secondOkr$.subscribe((secondOkr) => {
      const nowDate = new Date();
      const endDate = new Date(secondOkr.end.toDate());
      const differenceInTime = endDate.getTime() - nowDate.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);
      this.differenceInDay = Math.ceil(differenceInDays);
    });
  }

  secondOkrComplete() {
    this.dialog.open(CompleteOkrDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      data: { secondOkrId: this.secondOkrId },
    });
  }
}
