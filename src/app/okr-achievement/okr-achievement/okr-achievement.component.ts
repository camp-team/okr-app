import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteSecondOkrDialogComponent } from 'src/app/delete-second-okr-dialog/delete-second-okr-dialog.component';
import { OkrService } from 'src/app/services/okr.service';

@Component({
  selector: 'app-okr-achievement',
  templateUrl: './okr-achievement.component.html',
  styleUrls: ['./okr-achievement.component.scss'],
})
export class OkrAchievementComponent implements OnInit {
  childOkr: boolean;
  childOkrId: string;

  constructor(public okrService: OkrService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.okrService.childOkrs$.subscribe((childOkrs) => {
      childOkrs.map((childOkr) => {
        if (childOkrs.length === 0) {
          this.childOkr = false;
        } else if (childOkr.isComplete === true) {
          this.childOkr = false;
          this.childOkrId = childOkr.secondOkrId;
        } else if (childOkr.isComplete === false) {
          this.childOkr = true;
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
