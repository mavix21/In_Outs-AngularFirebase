import { Injectable, inject } from '@angular/core';
import * as firebase from '@angular/fire/auth';
import {
  CollectionReference,
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';

import { RegisterUser } from '../register/models/register-user.interface';
import { LoginUser } from '../login/models/login-user.interface';
import {
  Observable,
  catchError,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { UserProfile } from '../user-profile.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(firebase.Auth);
  private firestore: Firestore = inject(Firestore);

  private getUserCollectionRef(uid: string): CollectionReference {
    return collection(this.firestore, uid);
  }

  public firebaseAuthListener() {
    return firebase.authState(this.auth).pipe(
      tap((firebaseUser) =>
        console.log('Auth Listener: ', `${firebaseUser ?? 'Logged out'}`)
      ),
      switchMap((firebaseUser) => {
        if (firebaseUser === null) {
          return of(null);
        }

        const userCollection = this.getUserCollectionRef(firebaseUser.uid);
        const docRef = doc(userCollection, 'user');
        const docData$ = docData(docRef) as Observable<UserProfile>;

        return docData$;
      }),
      catchError((error) => {
        console.error('Error in auth listener, the user was not set', error);
        return of(null);
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
    const userCollection = this.getUserCollectionRef(newUser.uid);
    const docRef = doc(userCollection, 'user');
    await setDoc(docRef, newUser);
  }
}
