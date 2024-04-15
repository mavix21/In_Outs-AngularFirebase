import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideRouter } from '@angular/router';
import { provideState, provideStore } from '@ngrx/store';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { uiFeature } from './shared/state/ui.state';
import { authFeature } from './auth/store/auth.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore(),
    provideState(uiFeature),
    provideState(authFeature),
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(environment.firebase))
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
