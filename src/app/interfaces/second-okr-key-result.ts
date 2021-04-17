import { firestore } from 'firebase';

export interface SecondOkrKeyResult {
  secondOkrId: string;
  secondOkrObjectId: string;
  id?: string;
  key: string;
  target: number;
  current: number;
  percentage: string;
  lastUpdated: firestore.Timestamp;
}
