import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private storage: AngularFireStorage,
    private db: AngularFirestore
  ) {}

  async uploadAvatar(uid: string, avatar: string): Promise<void> {
    const time: number = new Date().getTime();
    const result = await this.storage
      .ref(`users/${uid}/okrs/${time}.png`)
      .putString(avatar, 'data_url');
    const avatarURL = await result.ref.getDownloadURL();
    return this.db.doc<User>(`users/${uid}`).update({ avatarURL });
  }
}
