import { Action, createFeature, createReducer, on } from '@ngrx/store';
import { loading, stopLoading } from './ui.actions';

export interface State {
  loading: boolean;
}

export const initialState: State = {
  loading: false,
};

export const uiFeature = createFeature({
  name: 'ui',
  reducer: createReducer(
    initialState,
    on(loading, (state) => ({ ...state, loading: true })),
    on(stopLoading, (state) => ({ ...state, loading: false }))
  ),
});

// const _uiReducer = createReducer(
//   initialState,

//   on(loading, (state) => ({ ...state, loading: true })),
//   on(stopLoading, (state) => ({ ...state, loading: false }))
// );

// export function uiReducer(state: any, action: Action) {
//   return _uiReducer(state, action);
// }
