import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { couldStartTrivia } from 'typescript';
import { Okr } from '../interfaces/okr';
import { OkrService } from '../services/okr.service';

@Component({
  selector: 'app-okr-delete-dialog',
  templateUrl: './okr-delete-dialog.component.html',
  styleUrls: ['./okr-delete-dialog.component.scss'],
})
export class OkrDeleteDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: Okr,
    private okrService: OkrService,
    private dialogRef: MatDialogRef<OkrDeleteDialogComponent>,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  okrDelete() {
    this.okrService.deleteOkr(this.data.id).then(() => {
      this.router.navigateByUrl('/manage/home');
      this.snackBar.open('削除しました。', '閉じる');
    });
    this.dialogRef.close();
  }
}
