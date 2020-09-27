import { firestore } from 'firebase';
export interface Okr {
  start: firestore.Timestamp;
  end: firestore.Timestamp;
  CreatorId: string;
  id: string;
  title: string;
  primaries: {
    title: string;
    subTasks: {
      title: string;
      terget: number;
      current: number;
      percentage: number;
      lastupdated: Date;
    }[];
  }[];
}
