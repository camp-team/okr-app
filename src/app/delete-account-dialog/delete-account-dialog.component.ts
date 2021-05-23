import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ParentOkr } from '../interfaces/parent-okr';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { OkrService } from '../services/okr.service';

@Component({
  selector: 'app-delete-account-dialog',
  templateUrl: './delete-account-dialog.component.html',
  styleUrls: ['./delete-account-dialog.component.scss'],
})
export class DeleteAccountDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<DeleteAccountDialogComponent>,
    private fns: AngularFireFunctions,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {}
  async deleteAccount() {
    this.loadingService.loading = true;
    this.dialogRef.close();
    const callable = this.fns.httpsCallable('deleteAfUser');
    try {
      await callable(this.authService.uid).toPromise();
      this.loadingService.loading = false;
      this.authService.afAuth.signOut().then(() => {
        this.router.navigateByUrl('/about');
        this.snackBar.open(
          'アカウントが削除されました。ご利用ありがとうございました。'
        );
      });
    } catch (e) {
      this.snackBar.open(
        '削除に失敗しました。再度ログインしてお試しください。',
        '閉じる'
      );
    }
  }

  closeDeleteAccountDialog() {
    this.dialogRef.close();
  }
}
