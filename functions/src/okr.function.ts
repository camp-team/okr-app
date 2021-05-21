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

export const deleteChildOkr = functions
  .region('asia-northeast1')
  .https.onCall(async (childOkrId: any) => {
    const childOkrKeyResultsRef = db
      .collectionGroup(`childOkrKeyResults`)
      .where('childOkrId', '==', childOkrId);
    const childOkrObjectivesRef = db
      .collectionGroup(`childOkrObjectives`)
      .where('childOkrId', '==', childOkrId);
    return Promise.all([
      deleteCollectionByReference(childOkrKeyResultsRef),
      deleteCollectionByReference(childOkrObjectivesRef),
    ]);
  });
