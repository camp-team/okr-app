import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ParentOkr } from '../interfaces/parentOkr';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { ParentOkrKeyResult } from '../interfaces/parentOkrKeyResult';
import firestore from 'firebase';
import { SecondOkr } from '../interfaces/second-okr';
import { SecondOkrKeyResult } from '../interfaces/second-okr-key-result';
import { SecondOkrObject } from '../interfaces/second-okr-object';
import { shareReplay, switchMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class OkrService {
  parentOkrs$ = this.authsearvice.afUser$.pipe(
    switchMap((afuser) => {
      if (afuser.uid) {
        return this.getOkrs();
      } else {
        return of(null);
      }
    }),
    shareReplay(1)
  );

  childOkrs$ = this.authsearvice.afUser$.pipe(
    switchMap((afUser) => {
      if (afUser) {
        return this.getSecondOkrs();
      } else {
        return of(null);
      }
    }),
    shareReplay(1)
  );

  constructor(
    private db: AngularFirestore,
    private authsearvice: AuthService
  ) {}

  async createParentOkr(params: {
    okrType: Omit<ParentOkr, 'parentOkrId' | 'isParentOkrComplete'>;
    KeyResultsType: string[];
    uid: string;
  }): Promise<void> {
    const parentOkrId = this.db.createId();
    const isParentOkrComplete = true;
    await this.db
      .doc<ParentOkr>(
        `users/${this.authsearvice.uid}/parentOkrs/${parentOkrId}`
      )
      .set({
        parentOkrId,
        isParentOkrComplete,
        ...params.okrType,
      });
    params.KeyResultsType.forEach((parentOkrKeyResult) => {
      this.createPrimary(parentOkrKeyResult, parentOkrId, params.uid);
    });
  }

  createPrimary(parentOkrKeyResult: string, parentOkrId: string, uid: string) {
    const parentOkrkeyResultId = this.db.createId();
    const value: ParentOkrKeyResult = {
      parentOkrkeyResult: parentOkrKeyResult,
      parentOkrId: parentOkrId,
      uid,
      parentOkrkeyResultId,
    };
    return this.db
      .doc<ParentOkrKeyResult>(
        `users/${this.authsearvice.uid}/parentOkrs/${parentOkrId}/parentOkrkeyResultes/${parentOkrkeyResultId}`
      )
      .set(value);
  }

  async createSecondOkr(params: {
    childOkr: Omit<SecondOkr, 'secondOkrId' | 'isComplete' | 'start'>;
    Objectives: string[];
    initialForm: Omit<
      SecondOkrKeyResult,
      | 'secondOkrId'
      | 'secondOkrKeyResultId'
      | 'lastUpdated'
      | 'secondOkrObjectId'
    >;
  }): Promise<void> {
    const secondOkrId = this.db.createId();
    const isComplete = true;
    await this.db
      .doc<SecondOkr>(
        `users/${this.authsearvice.uid}/secondOkrs/${secondOkrId}`
      )
      .set({
        secondOkrId,
        isComplete,
        ...params.childOkr,
      });
    params.Objectives.forEach((secondOkrObject) => {
      const average = 0;
      this.createSecondOkrObject(
        secondOkrObject,
        secondOkrId,
        params.initialForm
      );
    });
  }

  async createSecondOkrObject(
    secondOkrObject: string,
    secondOkrId: string,
    kyeResult: Omit<
      SecondOkrKeyResult,
      | 'secondOkrId'
      | 'secondOkrKeyResultId'
      | 'lastUpdated'
      | 'secondOkrObjectId'
    >
  ) {
    const secondOkrObjectId = this.db.createId();
    const value: SecondOkrObject = {
      secondOkrObject: secondOkrObject,
      secondOkrId: secondOkrId,
      average: 0,
      uid: this.authsearvice.uid,
      secondOkrObjectId,
    };
    await this.db
      .doc<SecondOkrObject>(
        `users/${this.authsearvice.uid}/secondOkrs/${secondOkrId}/secondOkrObjects/${secondOkrObjectId}`
      )
      .set(value);
    this.createkey(secondOkrId, secondOkrObjectId, kyeResult);
  }

  createkey(
    secondOkrId: string,
    secondOkrObjectId: string,
    kyeResult: Omit<
      SecondOkrKeyResult,
      | 'secondOkrId'
      | 'secondOkrKeyResultId'
      | 'lastUpdated'
      | 'secondOkrObjectId'
    >
  ) {
    const secondOkrKeyResultId = this.db.createId();
    return this.db
      .doc<SecondOkrKeyResult>(
        `users/${this.authsearvice.uid}/secondOkrs/${secondOkrId}/secondOkrObjects/${secondOkrObjectId}/secondOkrKeyResults/${secondOkrKeyResultId}`
      )
      .set({
        secondOkrKeyResultId,
        secondOkrObjectId,
        secondOkrId,
        lastUpdated: firestore.firestore.Timestamp.now(),
        ...kyeResult,
      });
  }

  createChildOkrKeyResult(
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
        lastUpdated: firestore.firestore.Timestamp.now(),
        ...secondOkrKeyResult,
      });
  }

  getOkrs(): Observable<ParentOkr[]> {
    return this.db
      .collection<ParentOkr>(`users/${this.authsearvice.uid}/parentOkrs`)
      .valueChanges();
  }

  getOkr(parentOkrId: string): Observable<ParentOkr> {
    return this.db
      .doc<ParentOkr>(
        `users/${this.authsearvice.uid}/parentOkrs/${parentOkrId}`
      )
      .valueChanges();
  }

  getSecondOkrs(): Observable<SecondOkr[]> {
    return this.db
      .collection<SecondOkr>(
        `users/${this.authsearvice.uid}/secondOkrs`,
        (ref) => ref.orderBy('end', 'desc')
      )
      .valueChanges();
  }

  achieveChildOkrIdOkrs(): Observable<SecondOkr[]> {
    return this.db
      .collection<SecondOkr>(
        `users/${this.authsearvice.uid}/secondOkrs`,
        (ref) =>
          ref.where('isComplete', '==', false).orderBy('end', 'desc').limit(3)
      )
      .valueChanges();
  }

  getSecondOkrCollection(): Observable<SecondOkr[]> {
    return this.db
      .collection<SecondOkr>(`users/${this.authsearvice.uid}/secondOkrs`)
      .valueChanges();
  }

  getChildOkrInProgress(): Observable<SecondOkr[]> {
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

  getPrimaries(parentOkrId: string): Observable<ParentOkrKeyResult[]> {
    return this.db
      .collection<ParentOkrKeyResult>(
        `users/${this.authsearvice.uid}/parentOkrs/${parentOkrId}/parentOkrkeyResultes`
      )
      .valueChanges();
  }

  getPrimary(
    parentOkrId: string,
    parentOkrkeyResultId: string
  ): Observable<ParentOkrKeyResult> {
    return this.db
      .doc<ParentOkrKeyResult>(
        `users/${this.authsearvice.uid}/parentOkrs/${parentOkrId}/parentOkrkeyResultes/${parentOkrkeyResultId}`
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

  deleteOkrDocument(okrId: string): Promise<void> {
    return this.db
      .doc<ParentOkr>(`users/${this.authsearvice.uid}/parentOkrs/${okrId}`)
      .delete();
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
    parentOkrId: string,
    objective: ParentOkr
  ): Promise<void> {
    return this.db
      .doc(`users/${uid}/parentOkrs/${parentOkrId}`)
      .update({ title: objective });
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

  updatePrimary(
    uid: string,
    parentOkrId: string,
    parentOkrkeyResultId: string,
    parentOkrkeyResult: ParentOkrKeyResult
  ): Promise<void> {
    return this.db
      .doc(
        `users/${uid}/parentOkrs/${parentOkrId}/parentOkrkeyResultes/${parentOkrkeyResultId}`
      )
      .update({ parentOkrkeyResult: parentOkrkeyResult });
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

  updateChildOkrObjective(params: {
    childOkrObjective: SecondOkrObject;
    uid: string;
    childOkrId: string;
    childOkrObjectId: string;
  }): Promise<void> {
    return this.db
      .doc(
        `users/${params.uid}/secondOkrs/${params.childOkrId}/secondOkrObjects/${params.childOkrObjectId}`
      )
      .update({ secondOkrObject: params.childOkrObjective });
  }

  updateSecondOkrKeyResult(params: {
    uid: string;
    childOkrId: string;
    childOkrObjectId: string;
    childOkrKeyResultId: string;
    childOkrKeyResult: Omit<SecondOkrKeyResult, 'lastUpdated'>;
  }): Promise<void> {
    return this.db
      .doc(
        `users/${params.uid}/secondOkrs/${params.childOkrId}/secondOkrObjects/${params.childOkrObjectId}/secondOkrKeyResults/${params.childOkrKeyResultId}`
      )
      .update({
        lastUpdated: firestore.firestore.Timestamp.now(),
        ...params.childOkrKeyResult,
      });
  }

  updateTitle(
    uid: string,
    parentOkrId: string,
    parentOkr: ParentOkr
  ): Promise<void> {
    return this.db
      .doc(`users/${uid}/parentOkrs/${parentOkrId}`)
      .update(parentOkr);
  }

  updatePrimaryTitle(
    uid: string,
    parentOkrId: string,
    parentOkrkeyResultId: string,
    parentOkrkeyResult: ParentOkrKeyResult
  ): Promise<void> {
    return this.db
      .doc(
        `users/${uid}/parentOkrs/${parentOkrId}/parentOkrkeyResultes/${parentOkrkeyResultId}`
      )
      .update(parentOkrkeyResult[0]);
  }
}
