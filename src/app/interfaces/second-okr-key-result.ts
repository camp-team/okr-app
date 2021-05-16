import * as firebase from 'firebase';

export interface SecondOkrKeyResult {
  secondOkrId: string;
  secondOkrObjectId: string;
  uid: string;
  secondOkrKeyResultId?: string;
  key: string;
  target: number;
  current: number;
  percentage: string;
  lastUpdated?: firebase.default.firestore.Timestamp;
}
