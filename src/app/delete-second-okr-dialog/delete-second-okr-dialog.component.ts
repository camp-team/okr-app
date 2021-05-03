import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OkrService } from '../services/okr.service';

@Component({
  selector: 'app-delete-second-okr-dialog',
  templateUrl: './delete-second-okr-dialog.component.html',
  styleUrls: ['./delete-second-okr-dialog.component.scss'],
})
export class DeleteSecondOkrDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: {
      secondOkrId: string;
    },
    private okrService: OkrService,
    private fns: AngularFireFunctions,
    private dialogRef: MatDialogRef<DeleteSecondOkrDialogComponent>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  cancel() {
    this.dialogRef.close();
  }

  deleteSecondOkr() {
    try {
      const callable = this.fns.httpsCallable('deleteSecondOkr');
      this.dialogRef.close();
      return callable(this.data.secondOkrId)
        .toPromise()
        .then(() => {
          this.okrService.deleteSecondOkrDocument(this.data.secondOkrId);
          this.snackBar.open('削除しました');
          this.okrService
            .getSecondOkrCollection()
            .subscribe((SecondOkrCollection) => {
              if (!SecondOkrCollection.length) {
                location.reload();
              }
            });
        });
    } catch (e) {
      this.snackBar.open('正常に削除されませんでした');
    }
  }
}
