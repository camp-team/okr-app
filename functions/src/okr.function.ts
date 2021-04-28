import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { deleteCollectionByReference } from './utils/firebase.function';

const db = admin.firestore();

export const deleteOkr = functions
  .region('asia-northeast1')
  .https.onCall(async (okrId: any) => {
    const primariesRef = db
      .collectionGroup(`primaries`)
      .where('okrId', '==', okrId);
    return Promise.all([deleteCollectionByReference(primariesRef)]);
  });

export const deleteSecondOkr = functions
  .region('asia-northeast1')
  .https.onCall(async (secondOkrId: any) => {
    const secondOkrKeyResults = db
      .collectionGroup(`secondOkrKeyResults`)
      .where('secondOkrId', '==', secondOkrId);
    const secondOkrObjectsRef = db
      .collectionGroup(`secondOkrObjects`)
      .where('secondOkrId', '==', secondOkrId);
    return Promise.all([
      deleteCollectionByReference(secondOkrKeyResults),
      deleteCollectionByReference(secondOkrObjectsRef),
    ]);
  });
