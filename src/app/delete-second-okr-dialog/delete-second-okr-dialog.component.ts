import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
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
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  cancel() {
    this.dialogRef.close();
  }

  deleteSecondOkr() {
    this.okrService.deleteSecondOkrDocument(this.data.secondOkrId);
    const callable = this.fns.httpsCallable('deleteSecondOkr');
    this.dialogRef.close();
    return callable(this.data.secondOkrId)
      .toPromise()
      .then(() => {
        this.snackBar.open('削除しました。');
      });
  }
}
