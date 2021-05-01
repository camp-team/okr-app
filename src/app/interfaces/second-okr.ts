import * as firebase from 'firebase';

export interface SecondOkr {
  start?: firebase.default.firestore.Timestamp;
  end?: firebase.default.firestore.Timestamp;
  secondOkrObjects?: string;
  creatorId?: string;
  secondOkrId?: string;
  isComplete: boolean;
}
