import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Okr } from '../interfaces/okr';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Primary } from '../interfaces/primary';
import { firestore } from 'firebase';
import { SecondOkr } from '../interfaces/second-okr';
import { SecondOkrKeyResult } from '../interfaces/second-okr-key-result';
import { SecondOkrObject } from '../interfaces/second-okr-object';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root',
})
export class OkrService {
  constructor(
    private db: AngularFirestore,
    private authsearvice: AuthService,
    private fns: AngularFireFunctions,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  createOkr(
    okr: Omit<Okr, 'okrId' | 'isComplete'>,
    primaries: string[],
    uid: string
  ): Promise<void> {
    const okrId = this.db.createId();
    const isComplete = true;
    return this.db
      .doc<Okr>(`users/${this.authsearvice.uid}/okrs/${okrId}`)
      .set({
        okrId,
        isComplete,
        ...okr,
      })
      .then(() => {
        primaries.forEach((primary) => {
          this.createPrimary(primary, okrId, uid);
        });
      });
  }

  createPrimary(primary: string, okrId: string, uid: string) {
    const primaryId = this.db.createId();
    const value: Primary = {
      primaryTitle: primary,
      okrId: okrId,
      uid,
      average: 0,
      primaryId,
    };
    return this.db
      .doc<Primary>(
        `users/${this.authsearvice.uid}/okrs/${okrId}/primaries/${primaryId}`
      )
      .set(value);
  }

  createSecondOkr(
    secondOkr: Omit<SecondOkr, 'secondOkrId' | 'isComplete'>,
    secondOkrObjects: string[]
  ): Promise<void> {
    const secondOkrId = this.db.createId();
    const isComplete = true;
    return this.db
      .doc<SecondOkr>(
        `users/${this.authsearvice.uid}/secondOkrs/${secondOkrId}`
      )
      .set({
        secondOkrId,
        isComplete,
        ...secondOkr,
      })
      .then(() => {
        secondOkrObjects.forEach((secondOkrObject) => {
          const average = 0;
          this.createSecondOkrObject(secondOkrObject, secondOkrId);
        });
      });
  }

  createSecondOkrObject(secondOkrObject: string, secondOkrId: string) {
    const secondOkrObjectId = this.db.createId();
    const value: SecondOkrObject = {
      secondOkrObject: secondOkrObject,
      secondOkrId: secondOkrId,
      average: 0,
      uid: this.authsearvice.uid,
      secondOkrObjectId,
    };
    return this.db
      .doc<SecondOkrObject>(
        `users/${this.authsearvice.uid}/secondOkrs/${secondOkrId}/secondOkrObjects/${secondOkrObjectId}`
      )
      .set(value);
  }

  createSecondOkrKeyResult(
    secondOkrKeyResult: Omit<
      SecondOkrKeyResult,
      'secondOkrKeyResultId' | 'lastUpdated'
    >,
    secondOkrObjectId: string,
    secondOkrId: string
  ) {
    const secondOkrKeyResultId = this.db.createId();
    return this.db
      .doc<SecondOkrKeyResult>(
        `users/${this.authsearvice.uid}/secondOkrs/${secondOkrId}/secondOkrObjects/${secondOkrObjectId}/secondOkrKeyResults/${secondOkrKeyResultId}`
      )
      .set({
        secondOkrKeyResultId,
        lastUpdated: firestore.Timestamp.now(),
        ...secondOkrKeyResult,
      });
  }

  getOkrs(): Observable<Okr[]> {
    return this.db
      .collection<Okr>(`users/${this.authsearvice.uid}/okrs`)
      .valueChanges();
  }

  getOkr(okrId: string): Observable<Okr> {
    return this.db
      .doc<Okr>(`users/${this.authsearvice.uid}/okrs/${okrId}`)
      .valueChanges();
  }

  getSecondOkrs(): Observable<SecondOkr[]> {
    return this.db
      .collection<SecondOkr>(
        `users/${this.authsearvice.uid}/secondOkrs`,
        (ref) => ref.orderBy('start', 'desc')
      )
      .valueChanges();
  }

  getSecondOkrCollection(): Observable<SecondOkr[]> {
    return this.db
      .collection<SecondOkr>(`users/${this.authsearvice.uid}/secondOkrs`)
      .valueChanges();
  }

  getSecondOkrId(): Observable<SecondOkr[]> {
    return this.db
      .collection<SecondOkr>(
        `users/${this.authsearvice.uid}/secondOkrs`,
        (ref) => ref.where('isComplete', '==', true)
      )
      .valueChanges();
  }

  getSecondOkrObjects(secondOkrId: string): Observable<SecondOkrObject[]> {
    return this.db
      .collection<SecondOkrObject>(
        `users/${this.authsearvice.uid}/secondOkrs/${secondOkrId}/secondOkrObjects`
      )
      .valueChanges();
  }

  getSecondOkr(secondOkrId: string): Observable<SecondOkr> {
    return this.db
      .doc<SecondOkr>(
        `users/${this.authsearvice.uid}/secondOkrs/${secondOkrId}`
      )
      .valueChanges();
  }

  getPrimaries(okrId: string): Observable<Primary[]> {
    return this.db
      .collection<Primary>(
        `users/${this.authsearvice.uid}/okrs/${okrId}/primaries`
      )
      .valueChanges();
  }

  getPrimary(okrid: string, primaryId: string): Observable<Primary> {
    return this.db
      .doc<Primary>(
        `users/${this.authsearvice.uid}/okrs/${okrid}/primaries/${primaryId}`
      )
      .valueChanges();
  }

  getSecondOkrKeyResultsCollection(
    secondOkrId: string
  ): Observable<SecondOkrKeyResult[]> {
    return this.db
      .collectionGroup<SecondOkrKeyResult>('secondOkrKeyResults', (ref) =>
        ref.where('secondOkrId', '==', secondOkrId)
      )
      .valueChanges();
  }

  getSecondOkrKeyResultId(
    secondOkrId: string
  ): Observable<SecondOkrKeyResult[]> {
    return this.db
      .collectionGroup<SecondOkrKeyResult>('secondOkrKeyResults', (ref) =>
        ref
          .where('secondOkrId', '==', secondOkrId)
          .orderBy('lastUpdated', 'desc')
          .limit(1)
      )
      .valueChanges();
  }

  deleteOkr(okrId: string): Promise<void> {
    const callable = this.fns.httpsCallable('deleteOkr');
    callable(okrId)
      .toPromise()
      .then(() => {
        this.router.navigateByUrl('/manage/home');
        this.snackBar.open('削除しました', '');
      });
    return this.db.doc(`users/${this.authsearvice.uid}/okrs/${okrId}`).delete();
  }

  deleteSecondOkrDocument(secondOkrId): Promise<void> {
    return this.db
      .doc<SecondOkr>(
        `users/${this.authsearvice.uid}/secondOkrs/${secondOkrId}`
      )
      .delete();
  }

  deleteSecondOkrKeyResultDocument(
    secondOkrId,
    secondOkrObjectId,
    secondOkrKeyResultId
  ): Promise<void> {
    return this.db
      .doc<SecondOkrKeyResult>(
        `users/${this.authsearvice.uid}/secondOkrs/${secondOkrId}/secondOkrObjects/${secondOkrObjectId}/secondOkrKeyResults/${secondOkrKeyResultId}`
      )
      .delete();
  }

  getSecondOkrKeyResult(uid: string): Observable<SecondOkrKeyResult[]> {
    return this.db
      .collectionGroup<SecondOkrKeyResult>('secondOkrKeyResults', (ref) =>
        ref.where('uid', '==', uid)
      )
      .valueChanges();
  }

  updateOkr(
    uid: string,
    okrId: string,
    okr: Omit<
      Okr,
      | 'okrId'
      | 'primaries'
      | 'start'
      | 'end'
      | 'creatorId'
      | 'title'
      | 'isComplete'
    >
  ): Promise<void> {
    return this.db.doc(`users/${uid}/okrs/${okrId}`).update({ title: okr });
  }

  updateSecondOkr(
    uid: string,
    secondOkrId: string,
    secondOkr: SecondOkr
  ): Promise<void> {
    return this.db
      .doc(`users/${uid}/secondOkrs/${secondOkrId}`)
      .update(secondOkr);
  }

  updateObjective() {}

  updatePrimary(
    uid: string,
    okrId: string,
    primaryId: string,
    primary: Primary
  ): Promise<void> {
    return this.db
      .doc(`users/${uid}/okrs/${okrId}/primaries/${primaryId}`)
      .update({ primaryTitle: primary });
  }

  updateSecondOkrObject(
    uid: string,
    secondOkrId: string,
    secondOkrObjectId: string,
    secondOkrObject: Omit<SecondOkrObject, 'secondOkrObject'>
  ): Promise<void> {
    return this.db
      .doc(
        `users/${uid}/secondOkrs/${secondOkrId}/secondOkrObjects/${secondOkrObjectId}`
      )
      .update(secondOkrObject);
  }

  updateSecondOkrPrimaryTitle(
    uid: string,
    secondOkrId: string,
    secondOkrObjectId: string,
    secondOkrObjects: SecondOkrObject
  ): Promise<void> {
    return this.db
      .doc(
        `users/${uid}/secondOkrs/${secondOkrId}/secondOkrObjects/${secondOkrObjectId}`
      )
      .update({ secondOkrObject: secondOkrObjects });
  }

  updateSecondOkrKeyResult(
    uid: string,
    secondOkrId: string,
    secondOkrObjectId: string,
    secondOkrKeyResultId: string,
    secondOkrKeyResult: Omit<SecondOkrKeyResult, 'lastUpdated'>
  ): Promise<void> {
    return this.db
      .doc(
        `users/${uid}/secondOkrs/${secondOkrId}/secondOkrObjects/${secondOkrObjectId}/secondOkrKeyResults/${secondOkrKeyResultId}`
      )
      .update({
        lastUpdated: firestore.Timestamp.now(),
        ...secondOkrKeyResult,
      });
  }

  updateTitle(uid: string, okrId: string, okr: Okr): Promise<void> {
    return this.db.doc(`users/${uid}/okrs/${okrId}`).update(okr);
  }

  updatePrimaryTitle(
    uid: string,
    okrId: string,
    primaryId: string,
    primary: Primary
  ): Promise<void> {
    return this.db
      .doc(`users/${uid}/okrs/${okrId}/primaries/${primaryId}`)
      .update(primary[0]);
  }
}
