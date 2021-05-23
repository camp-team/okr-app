import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingService } from '../services/loading.service';
import { OkrService } from '../services/okr.service';

@Component({
  selector: 'app-delete-child-okr-dialog',
  templateUrl: './delete-child-okr-dialog.component.html',
  styleUrls: ['./delete-child-okr-dialog.component.scss'],
})
export class DeleteChildOkrDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: {
      childOkrId: string;
    },
    private okrService: OkrService,
    private fns: AngularFireFunctions,
    private dialogRef: MatDialogRef<DeleteChildOkrDialogComponent>,
    private snackBar: MatSnackBar,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {}

  cancel() {
    this.dialogRef.close();
  }

  async deletechildOkr() {
    try {
      this.loadingService.loading = true;
      const callable = this.fns.httpsCallable('deleteChildOkr');
      this.dialogRef.close();
      await callable(this.data.childOkrId).toPromise();
      this.okrService.deleteChildOkrDocument(this.data.childOkrId);
      this.loadingService.loading = false;
      this.snackBar.open('削除しました');
      this.okrService
        .getChildOkrCollection()
        .subscribe((childOkrCollection) => {
          if (!childOkrCollection.length) {
            location.reload();
          }
        });
    } catch (e) {
      this.snackBar.open('正常に削除されませんでした');
    }
  }
}
