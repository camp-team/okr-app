import { firestore } from 'firebase';

export interface Okr {
  title: string;
  duration: firestore.Timestamp;
  primary1: string;
  primary2: string;
  primary3: string;
  trainerId: string;
}
