import * as firebase from 'firebase';

export interface SecondOkr {
  end?: firebase.default.firestore.Timestamp;
  secondOkrObjects?: string;
  creatorId?: string;
  secondOkrId?: string;
  isComplete: boolean;
}
