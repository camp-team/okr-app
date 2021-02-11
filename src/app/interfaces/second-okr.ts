import { firestore } from 'firebase';

export interface SecondOkr {
  start: firestore.Timestamp;
  end: firestore.Timestamp;
  secondOkrObjects: string;
  CreatorId: string;
  id: string;
  isComplete: boolean;
}
