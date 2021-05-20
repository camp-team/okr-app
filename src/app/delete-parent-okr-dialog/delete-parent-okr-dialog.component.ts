import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoadingService } from '../services/loading.service';
import { OkrService } from '../services/okr.service';

@Component({
  selector: 'app-okr-delete-dialog',
  templateUrl: './delete-parent-okr-dialog.component.html',
  styleUrls: ['./delete-parent-okr-dialog.component.scss'],
})
export class DeleteParentOkrDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { parentOkrId: string },
    private okrService: OkrService,
    private dialogRef: MatDialogRef<DeleteParentOkrDialogComponent>,
    private fns: AngularFireFunctions,
    private router: Router,
    private snackBar: MatSnackBar,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {}

  deleteParentOkr() {
    this.loadingService.loading = true;
    const callable = this.fns.httpsCallable('deleteParentOkr');
    this.dialogRef.close();
    callable(this.data.parentOkrId)
      .toPromise()
      .then(() => {
        this.okrService.deleteParentOkrDocument(this.data.parentOkrId);
        this.loadingService.loading = false;
        this.router.navigateByUrl('/manage/home');
        this.snackBar.open('削除しました', '');
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
