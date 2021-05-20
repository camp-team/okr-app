import * as firebase from 'firebase';

export interface ChildOkrKeyResult {
  childOkrId?: string;
  childOkrObjectiveId?: string;
  uid: string;
  childOkrKeyResultId?: string;
  key: string;
  target: number;
  current: number;
  percentage: string;
  lastUpdated?: firebase.default.firestore.Timestamp;
}
