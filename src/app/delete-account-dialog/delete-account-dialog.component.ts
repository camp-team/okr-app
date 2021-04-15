import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Okr } from '../interfaces/okr';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { OkrService } from '../services/okr.service';

@Component({
  selector: 'app-delete-account-dialog',
  templateUrl: './delete-account-dialog.component.html',
  styleUrls: ['./delete-account-dialog.component.scss'],
})
export class DeleteAccountDialogComponent implements OnInit {
  Okrs$: Observable<Okr[]> = this.okrService.getOkrs();
  okrId: string;

  constructor(
    private dialogRef: MatDialogRef<DeleteAccountDialogComponent>,
    private fns: AngularFireFunctions,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private loadingService: LoadingService,
    private okrService: OkrService
  ) {}

  ngOnInit(): void {
    this.Okrs$.subscribe((okrs) => {
      okrs.forEach((okr) => {
        this.okrId = okr.id;
      });
    });
  }
  deleteAccount(okrId: string) {
    this.loadingService.loading = true;
    this.okrService.deleteOkr(okrId);
    const callable = this.fns.httpsCallable('deleteAfUser');
    this.dialogRef.close();
    return callable(this.authService.uid)
      .toPromise()
      .then(() => {
        this.router.navigateByUrl('/');
        this.authService.afAuth.signOut().then(() => {
          this.snackBar.open(
            'アカウントを削除しました。反映には時間がかかります。'
          );
        });
      });
  }

  closeDeleteAccountDialog() {
    this.dialogRef.close();
  }
}
