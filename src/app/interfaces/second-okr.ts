import { firestore } from 'firebase';

export interface SecondOkr {
  start: firestore.Timestamp;
  end: firestore.Timestamp;
  primaries: any;
  CreatorId: string;
  id: string;
  isComplete: boolean;
}
