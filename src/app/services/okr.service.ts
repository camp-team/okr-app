import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Okr } from '../interfaces/okr';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class OkrService {
  constructor(private db: AngularFirestore, private snackBar: MatSnackBar) {}

  createOkr(okr: Okr) {
    console.log(okr);
    const id = this.db.createId();
    return this.db
      .doc(`okrs/${id}`)
      .set(okr)
      .then(() => {
        this.snackBar.open('作成しました', null, {
          duration: 2000,
        });
      });
  }
}
