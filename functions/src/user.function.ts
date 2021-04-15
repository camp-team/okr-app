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
    const primariesRef = db
      .collectionGroup(`primaries`)
      .where('uid', '==', user.uid);
    const secondOkrKeyResultsRef = db
      .collectionGroup(`secondOkrKeyResults`)
      .where('uid', '==', user.uid);
    const secondOkrObjectsResultsRef = db
      .collectionGroup(`secondOkrObjects`)
      .where('uid', '==', user.uid);
    const secondOkrs = db
      .collectionGroup(`secondOkrs`)
      .where('creatorId', '==', user.uid);
    return Promise.all([
      deleteCollectionByReference(primariesRef),
      deleteCollectionByReference(secondOkrKeyResultsRef),
      deleteCollectionByReference(secondOkrObjectsResultsRef),
      deleteCollectionByReference(secondOkrs),
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
