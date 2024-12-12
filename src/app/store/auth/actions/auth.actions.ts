import { createAction, props } from "@ngrx/store";

// Triggered when login is requested
export const loginRequest = createAction(
  "[Auth] Login Request",
  props<{ username: string; password: string }>()
);

// Triggered on successful login
export const loginSuccess = createAction(
  "[Auth] Login Success",
  props<{ token: string; username: string }>()
);

// Triggered on login failure
export const loginFailure = createAction(
  "[Auth] Login Failure",
  props<{ error: any }>()
);

// Triggered to clear store reducers
export const logout = createAction('[Auth] Logout');
