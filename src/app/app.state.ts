// import { ActionReducerMap } from '@ngrx/store';
import * as ui from './shared/state/ui.state';
import * as auth from './auth/store/auth.state';

export interface AppState {
  ui: ui.State;
  auth: auth.State;
}

// export const appReducers: ActionReducerMap<AppState> = {
//   ui: ui.uiReducer,
// };
