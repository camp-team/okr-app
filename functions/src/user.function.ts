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
    return admin.auth().deleteUser(data);
  });

export const deleteUser = functions
  .region('asia-northeast1')
  .auth.user()
  .onDelete((user) => {
    return db.doc(`users/${user.uid}`).delete();
  });

export const deleteCollection = functions
  .region('asia-northeast1')
  .auth.user()
  .onDelete((user) => {
    const okrsRef = db.collectionGroup(`okrs`).where('uid', '==', user.uid);
    const primariesRef = db
      .collectionGroup(`primaries`)
      .where('uid', '==', user.uid);
    const childOkrKeyResultsRef = db
      .collectionGroup(`childOkrKeyResults`)
      .where('uid', '==', user.uid);
    const childOkrObjectivesRef = db
      .collectionGroup(`childOkrObjectives`)
      .where('uid', '==', user.uid);
    const childOkrs = db
      .collectionGroup(`childOkrs`)
      .where('uid', '==', user.uid);
    const customers = db
      .collection(`customers`)
      .where('userId', '==', user.uid);
    return Promise.all([
      deleteCollectionByReference(okrsRef),
      deleteCollectionByReference(primariesRef),
      deleteCollectionByReference(childOkrKeyResultsRef),
      deleteCollectionByReference(childOkrObjectivesRef),
      deleteCollectionByReference(childOkrs),
      deleteCollectionByReference(customers),
    ]);
  });

export const deleteUserAccount = functions
  .region(`asia-northeast1`)
  .auth.user()
  .onDelete(async (user: any, _: any) => {
    const users = db.collection(`users`).where('uid', '==', user.uid);
    await deleteCollectionByReference(users);
    return;
  });
