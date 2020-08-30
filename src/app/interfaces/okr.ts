import { firestore } from 'firebase';
export interface Okr {
  title: string;
  start: firestore.Timestamp;
  end: firestore.Timestamp;
  primaries: string;
  trainerId: string;
  id: string;
}
