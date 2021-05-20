import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ParentOkr } from '../interfaces/parent-okr';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { ParentOkrKeyResult } from '../interfaces/parent-okr-key-result';
import firestore from 'firebase';
import { ChildOkr } from '../interfaces/child-okr';
import { ChildOkrKeyResult } from '../interfaces/child-okr-key-result';
import { ChildOkrObjective } from '../interfaces/child-okr-objective';
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
        return this.getChildOkrs();
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
    const parentOkrKeyResultId = this.db.createId();
    const value: ParentOkrKeyResult = {
      parentOkrKeyResult,
      parentOkrId,
      uid,
      parentOkrKeyResultId,
    };
    return this.db
      .doc<ParentOkrKeyResult>(
        `users/${this.authsearvice.uid}/parentOkrs/${parentOkrId}/parentOkrKeyResults/${parentOkrKeyResultId}`
      )
      .set(value);
  }

  async createChildOkr(params: {
    childOkr: Omit<ChildOkr, 'childOkrId' | 'isChildOkrComplete' | 'start'>;
    Objectives: string[];
    initialForm: Omit<
      ChildOkrKeyResult,
      | 'childOkrId'
      | 'childOkrKeyResultId'
      | 'lastUpdated'
      | 'childOkrObjectiveId'
    >;
  }): Promise<void> {
    const childOkrId = this.db.createId();
    const isChildOkrComplete = true;
    await this.db
      .doc<ChildOkr>(`users/${this.authsearvice.uid}/childOkrs/${childOkrId}`)
      .set({
        childOkrId,
        isChildOkrComplete,
        ...params.childOkr,
      });
    params.Objectives.forEach((childOkrObjective) => {
      const average = 0;
      this.createChildOkrObjective(
        childOkrObjective,
        childOkrId,
        params.initialForm
      );
    });
  }

  async createChildOkrObjective(
    childOkrObjective: string,
    childOkrId: string,
    kyeResult: Omit<
      ChildOkrKeyResult,
      | 'childOkrId'
      | 'childOkrKeyResultId'
      | 'lastUpdated'
      | 'childOkrObjectiveId'
    >
  ) {
    const childOkrObjectiveId = this.db.createId();
    const value: ChildOkrObjective = {
      childOkrObjective: childOkrObjective,
      childOkrId: childOkrId,
      average: 0,
      uid: this.authsearvice.uid,
      childOkrObjectiveId,
    };
    await this.db
      .doc<ChildOkrObjective>(
        `users/${this.authsearvice.uid}/childOkrs/${childOkrId}/childOkrObjectives/${childOkrObjectiveId}`
      )
      .set(value);
    this.createkey(childOkrId, childOkrObjectiveId, kyeResult);
  }

  createkey(
    childOkrId: string,
    childOkrObjectiveId: string,
    childOkrKeyResult: Omit<
      ChildOkrKeyResult,
      | 'childOkrId'
      | 'childOkrKeyResultId'
      | 'lastUpdated'
      | 'childOkrObjectiveId'
    >
  ) {
    const childOkrKeyResultId = this.db.createId();
    return this.db
      .doc<ChildOkrKeyResult>(
        `users/${this.authsearvice.uid}/childOkrs/${childOkrId}/childOkrObjectives/${childOkrObjectiveId}/childOkrKeyResults/${childOkrKeyResultId}`
      )
      .set({
        childOkrKeyResultId,
        childOkrObjectiveId,
        childOkrId,
        lastUpdated: firestore.firestore.Timestamp.now(),
        ...childOkrKeyResult,
      });
  }

  createChildOkrKeyResult(
    childOkrKeyResult: Omit<
      ChildOkrKeyResult,
      'childOkrKeyResultId' | 'lastUpdated'
    >,
    childOkrObjectiveId: string,
    childOkrId: string
  ) {
    const childOkrKeyResultId = this.db.createId();
    return this.db
      .doc<ChildOkrKeyResult>(
        `users/${this.authsearvice.uid}/childOkrs/${childOkrId}/childOkrObjectives/${childOkrObjectiveId}/childOkrKeyResults/${childOkrKeyResultId}`
      )
      .set({
        childOkrKeyResultId,
        lastUpdated: firestore.firestore.Timestamp.now(),
        ...childOkrKeyResult,
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

  getChildOkrs(): Observable<ChildOkr[]> {
    return this.db
      .collection<ChildOkr>(`users/${this.authsearvice.uid}/childOkrs`, (ref) =>
        ref.orderBy('end', 'desc')
      )
      .valueChanges();
  }

  achieveChildOkrIdOkrs(): Observable<ChildOkr[]> {
    return this.db
      .collection<ChildOkr>(`users/${this.authsearvice.uid}/childOkrs`, (ref) =>
        ref
          .where('isChildOkrComplete', '==', false)
          .orderBy('end', 'desc')
          .limit(3)
      )
      .valueChanges();
  }

  getChildOkrCollection(): Observable<ChildOkr[]> {
    return this.db
      .collection<ChildOkr>(`users/${this.authsearvice.uid}/childOkrs`)
      .valueChanges();
  }

  getChildOkrInProgress(): Observable<ChildOkr[]> {
    return this.db
      .collection<ChildOkr>(`users/${this.authsearvice.uid}/childOkrs`, (ref) =>
        ref.where('isChildOkrComplete', '==', true)
      )
      .valueChanges();
  }

  getChildOkrObjectives(childOkrId: string): Observable<ChildOkrObjective[]> {
    return this.db
      .collection<ChildOkrObjective>(
        `users/${this.authsearvice.uid}/childOkrs/${childOkrId}/childOkrObjectives`
      )
      .valueChanges();
  }

  getChildOkr(childOkrId: string): Observable<ChildOkr> {
    return this.db
      .doc<ChildOkr>(`users/${this.authsearvice.uid}/childOkrs/${childOkrId}`)
      .valueChanges();
  }

  getParentOkrKeyResults(
    parentOkrId: string
  ): Observable<ParentOkrKeyResult[]> {
    return this.db
      .collection<ParentOkrKeyResult>(
        `users/${this.authsearvice.uid}/parentOkrs/${parentOkrId}/parentOkrKeyResults`
      )
      .valueChanges();
  }

  getPrimary(
    parentOkrId: string,
    parentOkrKeyResultId: string
  ): Observable<ParentOkrKeyResult> {
    return this.db
      .doc<ParentOkrKeyResult>(
        `users/${this.authsearvice.uid}/parentOkrs/${parentOkrId}/parentOkrKeyResults/${parentOkrKeyResultId}`
      )
      .valueChanges();
  }

  getChildOkrKeyResultsCollection(
    childOkrId: string
  ): Observable<ChildOkrKeyResult[]> {
    return this.db
      .collectionGroup<ChildOkrKeyResult>('childOkrKeyResults', (ref) =>
        ref.where('childOkrId', '==', childOkrId)
      )
      .valueChanges();
  }

  getChildOkrKeyResultId(childOkrId: string): Observable<ChildOkrKeyResult[]> {
    return this.db
      .collectionGroup<ChildOkrKeyResult>('childOkrKeyResults', (ref) =>
        ref
          .where('childOkrId', '==', childOkrId)
          .orderBy('lastUpdated', 'desc')
          .limit(1)
      )
      .valueChanges();
  }

  deleteParentOkrDocument(parentOkrId: string): Promise<void> {
    return this.db
      .doc<ParentOkr>(
        `users/${this.authsearvice.uid}/parentOkrs/${parentOkrId}`
      )
      .delete();
  }

  deleteChildOkrDocument(childOkrId: string): Promise<void> {
    return this.db
      .doc<ChildOkr>(`users/${this.authsearvice.uid}/childOkrs/${childOkrId}`)
      .delete();
  }

  deleteChildOkrKeyResultDocument(
    childOkrId,
    childOkrObjectiveId,
    childOkrKeyResultId
  ): Promise<void> {
    return this.db
      .doc<ChildOkrKeyResult>(
        `users/${this.authsearvice.uid}/childOkrs/${childOkrId}/childOkrObjectives/${childOkrObjectiveId}/childOkrKeyResults/${childOkrKeyResultId}`
      )
      .delete();
  }

  getChildOkrKeyResult(uid: string): Observable<ChildOkrKeyResult[]> {
    return this.db
      .collectionGroup<ChildOkrKeyResult>('childOkrKeyResults', (ref) =>
        ref.where('uid', '==', uid)
      )
      .valueChanges();
  }

  updateOkr(
    uid: string,
    parentOkrId: string,
    parentOkrObjective: ParentOkr
  ): Promise<void> {
    return this.db
      .doc(`users/${uid}/parentOkrs/${parentOkrId}`)
      .update({ parentOkrObjective });
  }

  updateChildOkr(
    uid: string,
    childOkrId: string,
    childOkr: ChildOkr
  ): Promise<void> {
    return this.db.doc(`users/${uid}/childOkrs/${childOkrId}`).update(childOkr);
  }

  updateKeyResult(
    uid: string,
    parentOkrId: string,
    parentOkrKeyResultId: string,
    parentOkrKeyResult: ParentOkrKeyResult
  ): Promise<void> {
    return this.db
      .doc(
        `users/${uid}/parentOkrs/${parentOkrId}/parentOkrKeyResults/${parentOkrKeyResultId}`
      )
      .update({ parentOkrKeyResult });
  }

  updateChildOkrObjectiv(params: {
    uid: string;
    childOkrId: string;
    childOkrObjectiveId: string;
    childOkrObjective: Omit<ChildOkrObjective, 'childOkrObjective'>;
  }): Promise<void> {
    return this.db
      .doc(
        `users/${params.uid}/childOkrs/${params.childOkrId}/childOkrObjectives/${params.childOkrObjectiveId}`
      )
      .update(params.childOkrObjective);
  }

  updateChildOkrObjective(params: {
    childOkrObjective: ChildOkrObjective;
    uid: string;
    childOkrId: string;
    childOkrObjectiveId: string;
  }): Promise<void> {
    return this.db
      .doc(
        `users/${params.uid}/childOkrs/${params.childOkrId}/childOkrObjectives/${params.childOkrObjectiveId}`
      )
      .update({ childOkrObjective: params.childOkrObjective });
  }

  updateChildOkrKeyResult(params: {
    uid: string;
    childOkrId: string;
    childOkrObjectiveId: string;
    childOkrKeyResultId: string;
    childOkrKeyResult: Omit<ChildOkrKeyResult, 'lastUpdated'>;
  }): Promise<void> {
    return this.db
      .doc(
        `users/${params.uid}/childOkrs/${params.childOkrId}/childOkrObjectives/${params.childOkrObjectiveId}/childOkrKeyResults/${params.childOkrKeyResultId}`
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
    parentOkrKeyResultId: string,
    parentOkrKeyResult: ParentOkrKeyResult
  ): Promise<void> {
    return this.db
      .doc(
        `users/${uid}/parentOkrs/${parentOkrId}/parentOkrKeyResults/${parentOkrKeyResultId}`
      )
      .update(parentOkrKeyResult[0]);
  }
}
