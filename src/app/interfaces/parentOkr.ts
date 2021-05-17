import * as firebase from 'firebase';
export interface ParentOkr {
  uid?: string;
  isParentOkrComplete: boolean;
  parentOkrId?: string;
  keyResults?: string;
  objective?: string;
}
