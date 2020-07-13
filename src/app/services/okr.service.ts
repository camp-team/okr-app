import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Okr } from '../interfaces/okr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
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

  editOkr(okr: Okr) {
    console.log(okr);
    const id = this.db.createId();
    return this.db
      .doc(`okrs/${id}`)
      .set(okr)
      .then(() => {
        this.snackBar.open('作成しました', null, {
          duration: 2000,
        });
        this.router.navigateByUrl('manage/home');
      });
  }

  getOkr(trainerId: string): Observable<Okr> {
    return this.db
      .collection<Okr>('okrs', (ref) => ref.where('trainerId', '==', trainerId))
      .valueChanges()
      .pipe(
        map((pets) => {
          if (pets.length) {
            return pets[0];
          } else {
            return null;
          }
        })
      );
  }
}
