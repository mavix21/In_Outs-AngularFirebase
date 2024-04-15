import { createAction, props } from '@ngrx/store';
import { UserProfile } from '../user-profile.interface';

export const setUser = createAction(
  '[Login Page] setUser',
  props<{ user: UserProfile }>()
);

export const unsetUser = createAction('[Login Page] unsetUser');
