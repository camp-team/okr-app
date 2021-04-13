import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Okr } from '../interfaces/okr';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Primary } from '../interfaces/primary';
import { SubTask } from '../interfaces/sub-task';
import { firestore } from 'firebase';
import { SecondOkr } from '../interfaces/second-okr';
import { SecondOkrKeyResult } from '../interfaces/second-okr-key-result';
import { SecondOkrObject } from '../interfaces/second-okr-object';
import { object } from 'firebase-functions/lib/providers/storage';
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
    okr: Omit<Okr, 'id' | 'isComplete'>,
    primaries: string[]
  ): Promise<void> {
    const id = this.db.createId();
    const isComplete = true;
    return this.db
      .doc<Okr>(`users/${this.authsearvice.uid}/okrs/${id}`)
      .set({
        id,
        isComplete,
        ...okr,
      })
      .then(() => {
        primaries.forEach((primary) => {
          this.createPrimary(primary, id);
        });
      });
  }

  createPrimary(primary: string, okrId: string) {
    const id = this.db.createId();
    const value: Primary = {
      primaryTitle: primary,
      okrId: okrId,
      average: 0,
      id,
    };
    return this.db
      .doc<Primary>(
        `users/${this.authsearvice.uid}/okrs/${okrId}/primaries/${id}`
      )
      .set(value);
  }

  createSecondOkr(
    secondOkr: Omit<SecondOkr, 'id' | 'isComplete'>,
    secondOkrObjects: string[]
  ): Promise<void> {
    const id = this.db.createId();
    const isComplete = true;
    return this.db
      .doc<SecondOkr>(`users/${this.authsearvice.uid}/secondOkrs/${id}`)
      .set({
        id,
        isComplete,
        ...secondOkr,
      })
      .then(() => {
        secondOkrObjects.forEach((secondOkrObject) => {
          const average = 0;
          this.createSecondOkrObject(secondOkrObject, id);
        });
      });
  }

  createSecondOkrObject(secondOkrObject: string, okrId: string) {
    const id = this.db.createId();
    const value: SecondOkrObject = {
      secondOkrObject: secondOkrObject,
      average: 0,
      id,
    };
    return this.db
      .doc<SecondOkrObject>(
        `users/${this.authsearvice.uid}/secondOkrs/${okrId}/secondOkrObjects/${id}`
      )
      .set(value);
  }

  createSubTask(
    subTask: Omit<SubTask, 'id' | 'lastUpdated'>,
    primaryId: string,
    okrId: string
  ) {
    const id = this.db.createId();
    return this.db
      .doc<SubTask>(
        `users/${this.authsearvice.uid}/okrs/${okrId}/primaries/${primaryId}/subTasks/${id}`
      )
      .set({
        id,
        lastUpdated: firestore.Timestamp.now(),
        ...subTask,
      });
  }

  createSecondOkrKeyResult(
    secondOkrKeyResult: Omit<SecondOkrKeyResult, 'id' | 'lastUpdated'>,
    secondOkrObjectId: string,
    secondOkrId: string
  ) {
    const id = this.db.createId();
    return this.db
      .doc<SecondOkrKeyResult>(
        `users/${this.authsearvice.uid}/secondOkrs/${secondOkrId}/secondOkrObjects/${secondOkrObjectId}/secondOkrKeyResults/${id}`
      )
      .set({
        id,
        lastUpdated: firestore.Timestamp.now(),
        ...secondOkrKeyResult,
      });
  }

  deleteOkr(okrId: string): Promise<void> {
    const callable = this.fns.httpsCallable('deleteOkr');
    callable(okrId)
      .toPromise()
      .then(() => {
        this.router.navigateByUrl('/manage/home');
        this.snackBar.open('削除しました。', '');
      });
    return this.db.doc(`users/${this.authsearvice.uid}/okrs/${okrId}`).delete();
  }

  getOkrs(): Observable<Okr[]> {
    return this.db
      .collection<Okr>(`users/${this.authsearvice.uid}/okrs`)
      .valueChanges();
  }

  getOkr(id: string): Observable<Okr> {
    return this.db
      .doc<Okr>(`users/${this.authsearvice.uid}/okrs/${id}`)
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

  getSecondOkrId(): Observable<SecondOkr[]> {
    return this.db
      .collection<SecondOkr>(
        `users/${this.authsearvice.uid}/secondOkrs`,
        (ref) => ref.where('isComplete', '==', true)
      )
      .valueChanges();
  }

  getSecondOkrObjects(id: string): Observable<SecondOkrObject[]> {
    return this.db
      .collection<SecondOkrObject>(
        `users/${this.authsearvice.uid}/secondOkrs/${id}/secondOkrObjects`
      )
      .valueChanges();
  }

  getSecondOkr(id: string): Observable<SecondOkr> {
    return this.db
      .doc<SecondOkr>(`users/${this.authsearvice.uid}/secondOkrs/${id}`)
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

  getSubTask(
    okrId: string,
    primaryId: string,
    subTaskId: string
  ): Observable<SubTask> {
    return this.db
      .doc<SubTask>(
        `users/${this.authsearvice.uid}/okrs/${okrId}/primaries/${primaryId}/subTasks/${subTaskId}`
      )
      .valueChanges();
  }

  getSubTasksCollection(okrId: string): Observable<SubTask[]> {
    return this.db
      .collectionGroup<SubTask>('subTasks', (ref) =>
        ref.where('okrId', '==', okrId)
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
      | 'id'
      | 'primaries'
      | 'start'
      | 'end'
      | 'CreatorId'
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
    console.log(uid);
    console.log(okrId);
    console.log(primaryId);
    console.log(primary);
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

  updateSubTask(
    uid: string,
    okrId: string,
    primaryId: string,
    subTaskId: string,
    subTask: Omit<SubTask, 'lastUpdated'>
  ): Promise<void> {
    return this.db
      .doc(
        `users/${uid}/okrs/${okrId}/primaries/${primaryId}/subTasks/${subTaskId}`
      )
      .update({
        lastUpdated: firestore.Timestamp.now(),
        ...subTask,
      });
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
