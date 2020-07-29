import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Okr } from '../interfaces/okr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class OkrService {
  constructor(
    private db: AngularFirestore,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  editOkr(okr: Omit<Okr, 'id'>): Promise<void> {
    console.log(okr);
    const id = this.db.createId();
    return this.db
      .doc(`okrs/${id}`)
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
    return this.db.collection<Okr>(`okrs`).valueChanges();
  }

  getOkr(id: string): Observable<Okr> {
    console.log(id);
    return this.db.doc<Okr>(`okrs/${id}`).valueChanges();
  }
}
