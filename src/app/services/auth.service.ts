import { Injectable, inject } from '@angular/core';
import * as firebase from '@angular/fire/auth';
import {
  CollectionReference,
  Firestore,
  addDoc,
  collection,
  doc,
  setDoc,
} from '@angular/fire/firestore';

import { RegisterUser } from '../auth/register/models/register-user.interface';
import { LoginUser } from '../auth/login/models/login-user.interface';
import { Observable, map, tap } from 'rxjs';
import { UserProfile } from '../auth/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(firebase.Auth);
  private firestore: Firestore = inject(Firestore);
  private usersCollection: CollectionReference | null = null;

  constructor() {}

  public firebaseAuthListener(): Observable<firebase.User | null> {
    return firebase.authState(this.auth).pipe(
      tap((firebaseUser) => {
        console.log({ firebaseUser });
      })
    );
  }

  public isAuthenticated(): Observable<boolean> {
    return firebase.authState(this.auth).pipe(map((user) => user !== null));
  }

  public async createUser({ username, email, password }: RegisterUser) {
    return firebase.createUserWithEmailAndPassword(this.auth, email, password);
  }

  public signIn({
    email,
    password,
  }: LoginUser): Promise<firebase.UserCredential> {
    return firebase.signInWithEmailAndPassword(this.auth, email, password);
  }

  public logout(): Promise<void> {
    return firebase.signOut(this.auth);
  }

  public async addUserProfile(newUser: UserProfile) {
    this.usersCollection = collection(this.firestore, newUser.uid);
    const docRef = doc(this.usersCollection, 'user');
    await setDoc(docRef, newUser);
  }
}
