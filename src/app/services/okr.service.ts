import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Okr } from '../interfaces/okr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})
export class OkrService {
  constructor(
    private db: AngularFirestore,
    private snackBar: MatSnackBar,
    private router: Router,
    private authsearvice: AuthService
  ) {}

  editOkr(okr: Omit<Okr, 'id'>): Promise<void> {
    console.log(okr);
    const id = this.db.createId();
    return this.db
      .doc<Okr>(`users/${this.authsearvice.uid}/okrs/${id}`)
      .set({
        id,
        ...okr,
      })
      .then(() => {
        this.snackBar.open('作成しました', null, {
          duration: 2000,
        });
        this.router.navigateByUrl('manage/home');
      });
  }

  getOkrs(): Observable<Okr[]> {
    return this.db
      .collection<Okr>(`users/${this.authsearvice.uid}/okrs`)
      .valueChanges();
  }

  getOkr(id: string): Observable<Okr> {
    console.log(id);
    return this.db
      .doc<Okr>(`users/${this.authsearvice.uid}/okrs/${id}`)
      .valueChanges();
  }

  updateOkr(okr: Okr): Promise<void> {
    return this.db.doc(`okrs/${okr.id}`).set(okr, {
      merge: true,
    });
  }
}
