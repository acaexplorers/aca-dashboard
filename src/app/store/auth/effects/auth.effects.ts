import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from 'app/services/auth.service';
import * as AuthActions from 'app/store/auth/actions/auth.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authService: AuthService) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginRequest), // Listen for the loginRequest action
      //tap(({ username, password }) => {
        // console.log("🚀 loginRequest action disparada");
        // console.log("🔑 Username recibido en Effect:", username);
        // console.log("🔒 Password recibido en Effect:", password);
      //}), 
      switchMap(({ username, password }) =>
        this.authService.login(username, password).pipe(
          map((response) =>
            AuthActions.loginSuccess({
              token: response.jwt,
              username: response.user.username,
            })
          ),
          catchError((error) => of(AuthActions.loginFailure({ error })))
        )
      )
    )
  );
}
