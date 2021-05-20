import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteChildOkrDialogComponent } from 'src/app/delete-child-okr-dialog/delete-child-okr-dialog.component';
import { ChildOkr } from 'src/app/interfaces/child-okr';
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
      childOkrs.map((childOkr: ChildOkr) => {
        if (childOkrs.length === 0) {
          this.childOkr = false;
        } else if (childOkr.isChildOkrComplete) {
          this.childOkr = false;
          this.childOkrId = childOkr.childOkrId;
        } else if (!childOkr.isChildOkrComplete) {
          this.childOkr = true;
        }
      });
    });
  }

  deleteChildOkr(childOkrId: ChildOkr) {
    this.dialog.open(DeleteChildOkrDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      data: {
        childOkrId,
      },
    });
  }
}
