import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { OkrService } from '../services/okr.service';

@Component({
  selector: 'app-okr-delete-dialog',
  templateUrl: './okr-delete-dialog.component.html',
  styleUrls: ['./okr-delete-dialog.component.scss'],
})
export class OkrDeleteDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { okrId: string },
    private okrService: OkrService,
    private dialogRef: MatDialogRef<OkrDeleteDialogComponent>,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  okrDelete() {
    console.log(this.data.okrId);
    this.okrService.deleteOkr(this.data.okrId).then(() => {
      this.router.navigateByUrl('/manage/home');
      this.snackBar.open('削除しました。', '');
    });
    this.dialogRef.close();
  }

  closeDeleteOKRDialog() {
    this.dialogRef.close();
  }
}
