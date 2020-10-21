import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Okr } from '../interfaces/okr';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Primary } from '../interfaces/primary';
import { SubTask } from '../interfaces/sub-task';
@Injectable({
  providedIn: 'root',
})
export class OkrService {
  constructor(
    private db: AngularFirestore,
    private authsearvice: AuthService
  ) {}

  createOkr(okr: Omit<Okr, 'id'>, primaries: string[]): Promise<void> {
    const id = this.db.createId();
    return this.db
      .doc<Okr>(`users/${this.authsearvice.uid}/okrs/${id}`)
      .set({
        id,
        ...okr,
      })
      .then(() => {
        primaries.forEach((primary) => {
          this.createPrimary(primary, id);
        });
      });
  }

  createPrimary(primary: string, okrId: string) {
    const id = this.db.createId();
    const value: Primary = {
      titles: primary,
      id,
    };
    return this.db
      .doc<Primary>(
        `users/${this.authsearvice.uid}/okrs/${okrId}/primaries/${id}`
      )
      .set(value);
  }

  createSubTask(
    subTask: Omit<SubTask, 'id'>,
    primaryId: string,
    okrId: string
  ) {
    const id = this.db.createId();
    return this.db
      .doc<SubTask>(
        `users/${this.authsearvice.uid}/okrs/${okrId}/primaries/${primaryId}/subTasks/${id}`
      )
      .set({
        id,
        ...subTask,
      });
  }

  getOkrs(): Observable<Okr[]> {
    return this.db
      .collection<Okr>(`users/${this.authsearvice.uid}/okrs`)
      .valueChanges();
  }

  getOkr(id: string): Observable<Okr> {
    return this.db
      .doc<Okr>(`users/${this.authsearvice.uid}/okrs/${id}`)
      .valueChanges();
  }

  getPrimaries(okrId: string): Observable<Primary[]> {
    return this.db
      .collection<Primary>(
        `users/${this.authsearvice.uid}/okrs/${okrId}/primaries`
      )
      .valueChanges();
  }

  getPrimary(okrid: string, primaryId: string): Observable<Primary> {
    return this.db
      .doc<Primary>(
        `users/${this.authsearvice.uid}/okrs/${okrid}/primaries/${primaryId}`
      )
      .valueChanges();
  }

  getSubTask(
    okrId: string,
    primaryId: string,
    subTaskId: string
  ): Observable<SubTask> {
    return this.db
      .doc<SubTask>(
        `users/${this.authsearvice.uid}/okrs/${okrId}/primaries/${primaryId}/subTasks/${subTaskId}`
      )
      .valueChanges();
  }

  getSubTasksCollection(okrId: string): Observable<SubTask[]> {
    return this.db
      .collectionGroup<SubTask>('subTasks', (ref) =>
        ref.where('okrId', '==', okrId)
      )
      .valueChanges();
  }

  updateSubTask(
    uid: string,
    okrId: string,
    primaryId: string[],
    subTaskId: string
  ): Promise<void> {
    return this.db
      .doc(
        `users/${uid}/okrs/${okrId}/primaries/${primaryId}/subTasks/${subTaskId}`
      )
      .update(subTaskId);
  }
}
