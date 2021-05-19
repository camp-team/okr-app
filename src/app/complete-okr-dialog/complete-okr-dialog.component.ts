import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ChildOkr } from '../interfaces/child-okr';
import { AuthService } from '../services/auth.service';
import { OkrService } from '../services/okr.service';

@Component({
  selector: 'app-complete-okr-dialog',
  templateUrl: './complete-okr-dialog.component.html',
  styleUrls: ['./complete-okr-dialog.component.scss'],
})
export class CompleteOkrDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { childOkrId: string },
    private okrService: OkrService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialogRef: MatDialogRef<CompleteOkrDialogComponent>
  ) {}

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close();
  }

  completeOkr() {
    const childOkrValue: ChildOkr = {
      isChildOkrComplete: false,
    };
    this.okrService
      .updateChildOkr(this.authService.uid, this.data.childOkrId, childOkrValue)
      .then(() => {
        this.dialogRef.close();
        this.snackBar.open('お疲れ様でした✨');
        this.router.navigateByUrl('manage/achieve');
      });
  }
}
