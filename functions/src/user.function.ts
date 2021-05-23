import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { deleteCollectionByReference } from './utils/firebase.function';

const db = admin.firestore();

export const createUser = functions
  .region('asia-northeast1')
  .auth.user()
  .onCreate((user) => {
    return db.doc(`users/${user.uid}`).set({
      uid: user.uid,
      name: user.displayName,
      avatarURL: user.photoURL,
      email: user.email,
      createdAt: new Date(),
    });
  });

export const deleteAfUser = functions
  .region('asia-northeast1')
  .https.onCall((data: any, context: any) => {
    const usersCollection = db.collection(`users`).where('uid', '==', data);
    const customers = db.collection(`customers`).where('userId', '==', data);
    const parentOkrsRef = db
      .collectionGroup(`parentOkrs`)
      .where('uid', '==', data);
    const parentOkrKeyResultsRef = db
      .collectionGroup(`parentOkrKeyResults`)
      .where('uid', '==', data);
    const childOkrsRef = db
      .collectionGroup(`childOkrs`)
      .where('uid', '==', data);
    const childOkrObjectivesRef = db
      .collectionGroup(`childOkrObjectives`)
      .where('uid', '==', data);
    const childOkrKeyResultsRef = db
      .collectionGroup(`childOkrKeyResults`)
      .where('uid', '==', data);
    return {
      auth: admin.auth().deleteUser(data),
      userData: db.doc(`users/${data}`).delete(),
      usersCollection: usersCollection,
      deleteCollection: Promise.all([
        deleteCollectionByReference(customers),
        deleteCollectionByReference(parentOkrsRef),
        deleteCollectionByReference(parentOkrKeyResultsRef),
        deleteCollectionByReference(childOkrsRef),
        deleteCollectionByReference(childOkrObjectivesRef),
        deleteCollectionByReference(childOkrKeyResultsRef),
      ]),
    };
  });
