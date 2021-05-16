import { Component, Inject, Input, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoadingService } from '../services/loading.service';
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
    private fns: AngularFireFunctions,
    private router: Router,
    private snackBar: MatSnackBar,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {}

  okrDelete() {
    this.loadingService.loading = true;
    const callable = this.fns.httpsCallable('deleteOkr');
    this.dialogRef.close();
    callable(this.data.okrId)
      .toPromise()
      .then(() => {
        this.okrService.deleteOkrDocument(this.data.okrId);
        this.loadingService.loading = false;
        this.router.navigateByUrl('/manage/home');
        this.snackBar.open('削除しました', '');
      });
  }

  closeDeleteOKRDialog() {
    this.dialogRef.close();
  }
}
