import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import auth from 'firebase/app';
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../interfaces/user';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  uid: string;
  initialLogin: boolean;
  afUser$: Observable<firebase.default.User> = this.afAuth.user.pipe(
    map((user) => {
      if (user) {
        this.uid = user.uid;
        return user;
      } else {
        return null;
      }
    })
  );
  user$: Observable<User> = this.afAuth.authState.pipe(
    switchMap((afUser) => {
      if (afUser) {
        this.uid = afUser && afUser.uid;
        return this.db.doc<User>(`users/${afUser.uid}`).valueChanges();
      } else {
        return of(null);
      }
    })
  );

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private snackBar: MatSnackBar,
    private db: AngularFirestore,
    private loadingService: LoadingService
  ) {}

  getUser(userId: string) {
    return this.db.doc<User>(`users/${userId}`).valueChanges();
  }

  login() {
    const provider = new firebase.default.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    this.afAuth.signInWithPopup(provider).then((result) => {
      if (result.additionalUserInfo.isNewUser) {
        this.initialLogin = true;
      }
      this.loadingService.loading = true;
      this.snackBar.open('ログインしました', null, {
        duration: 2000,
      });
    });
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.snackBar.open('ログアウトしました', null);
      this.router.navigateByUrl('/about');
    });
  }
}
