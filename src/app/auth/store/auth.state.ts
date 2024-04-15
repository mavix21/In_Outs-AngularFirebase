import { createFeature, createReducer, on } from '@ngrx/store';
import { setUser, unsetUser } from './auth.actions';
import { UserProfile } from '@angular/fire/auth';

export interface State {
  user: UserProfile | null;
}

export const initialState: State = {
  user: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(setUser, (state, { user }) => ({ ...state, user: { ...user } })),
    on(unsetUser, (state) => ({ ...state, user: null }))
  ),
});
