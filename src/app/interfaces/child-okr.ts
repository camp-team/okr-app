import * as firebase from 'firebase';

export interface ChildOkr {
  end?: firebase.default.firestore.Timestamp;
  childOkrObjectives?: string;
  uid?: string;
  childOkrId?: string;
  isChildOkrComplete: boolean;
  childOkrTarget?: string;
}
