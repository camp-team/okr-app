import { firestore } from 'firebase';

export interface SubTask {
  okrId: string;
  primaryId: string;
  id: string;
  key: string;
  target: number;
  current: number;
  lastUpdated: firestore.Timestamp;
  percentage: string;
}
