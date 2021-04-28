import { firestore } from 'firebase';
export interface Okr {
  primaries: any;
  start?: firestore.Timestamp;
  end?: firestore.Timestamp;
  creatorId: string;
  okrId: string;
  title: string;
  isComplete: boolean;
}
