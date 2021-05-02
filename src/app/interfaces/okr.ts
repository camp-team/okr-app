import * as firebase from 'firebase';
export interface Okr {
  primaries: any;
  start?: firebase.default.firestore.Timestamp;
  end?: firebase.default.firestore.Timestamp;
  creatorId: string;
  okrId: string;
  title: string;
  isComplete: boolean;
}
