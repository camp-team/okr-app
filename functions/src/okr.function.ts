import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { deleteCollectionByReference } from './utils/firebase.function';

const db = admin.firestore();

export const deleteParentOkr = functions
  .region('asia-northeast1')
  .https.onCall(async (parentOkrId: any) => {
    const parentOkrKeyResultsRef = db
      .collectionGroup(`parentOkrKeyResults`)
      .where('parentOkrId', '==', parentOkrId);
    return Promise.all([deleteCollectionByReference(parentOkrKeyResultsRef)]);
  });

export const deleteSecondOkr = functions
  .region('asia-northeast1')
  .https.onCall(async (secondOkrId: any) => {
    const secondOkrKeyResultsRef = db
      .collectionGroup(`secondOkrKeyResults`)
      .where('secondOkrId', '==', secondOkrId);
    const secondOkrObjectsRef = db
      .collectionGroup(`secondOkrObjects`)
      .where('secondOkrId', '==', secondOkrId);
    return Promise.all([
      deleteCollectionByReference(secondOkrKeyResultsRef),
      deleteCollectionByReference(secondOkrObjectsRef),
    ]);
  });
