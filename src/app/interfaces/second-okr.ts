import { firestore } from 'firebase';

export interface SecondOkr {
  start?: firestore.Timestamp;
  end?: firestore.Timestamp;
  secondOkrObjects?: string;
  creatorId?: string;
  secondOkrId?: string;
  isComplete: boolean;
}
