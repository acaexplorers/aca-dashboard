import { createReducer, on } from "@ngrx/store";
import * as AuthActions from "app/store/auth/actions/auth.actions";
import { initialAuthState } from "app/store/auth/auth.state";

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.loginRequest, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { token, username }) => ({
    ...state,
    token,
    username,
    loading: false,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
