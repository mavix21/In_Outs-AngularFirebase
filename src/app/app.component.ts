import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as firebase from '@angular/fire/auth';
import { Store } from '@ngrx/store';

import { AuthService } from './auth/services/auth.service';
import { AppState } from './app.state';
import { setUser, unsetUser } from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private authService = inject(AuthService);
  private store: Store<AppState> = inject(Store);
  private auth: firebase.Auth = inject(firebase.Auth);

  constructor() {
    // Listen to auth status changes
    this.authService.firebaseAuthListener().subscribe((user) => {
      if (user) {
        console.log('Setting user ... : ', user);
        this.store.dispatch(setUser({ user }));
      } else {
        this.store.dispatch(unsetUser());
      }
    });
  }
}
