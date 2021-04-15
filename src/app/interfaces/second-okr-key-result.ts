import { firestore } from 'firebase';

export interface SecondOkrKeyResult {
  secondOkrId: string;
  secondOkrObjectId: string;
  uid: string;
  id?: string;
  key: string;
  target: number;
  current: number;
  percentage: string;
  lastUpdated: firestore.Timestamp;
}
