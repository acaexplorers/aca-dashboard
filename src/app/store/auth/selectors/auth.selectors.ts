import { createSelector } from "@ngrx/store";
import { AuthState } from "app/store/auth/auth.state";

export const selectAuthState = (state: any) => state.auth;

export const selectIsLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

export const selectAuthToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

export const selectAuthUsername = createSelector(
  selectAuthState,
  (state: AuthState) => state.username
);
