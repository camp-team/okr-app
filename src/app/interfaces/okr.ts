import { firestore } from 'firebase';
export interface Okr {
  primaries: any;
  start?: firestore.Timestamp;
  end?: firestore.Timestamp;
  CreatorId: string;
  id: string;
  title: string;
  isComplete: boolean;
}
