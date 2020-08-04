import { firestore } from 'firebase';

export interface Okr {
  title: string;
  start: firestore.Timestamp;
  end: firestore.Timestamp;
  primary1: string;
  primary2: string;
  primary3: string;
  trainerId: string;
  id: string;
}
