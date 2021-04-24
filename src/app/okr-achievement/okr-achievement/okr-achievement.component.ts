import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DeleteSecondOkrDialogComponent } from 'src/app/delete-second-okr-dialog/delete-second-okr-dialog.component';
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
  secondOkrId: string;

  constructor(public okrService: OkrService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.secondOkrs$.subscribe((secondOkrs) => {
      secondOkrs.map((secondOkr) => {
        if (secondOkrs.length === 0) {
          this.secondOkr = false;
        } else if (secondOkr.isComplete === true) {
          this.secondOkr = false;
          this.secondOkrId = secondOkr.id;
        } else if (secondOkr.isComplete === false) {
          this.secondOkr = true;
        }
      });
    });
  }

  deleteSecondOkr(secondOkrId) {
    this.dialog.open(DeleteSecondOkrDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      data: {
        secondOkrId: secondOkrId,
      },
    });
  }
}
