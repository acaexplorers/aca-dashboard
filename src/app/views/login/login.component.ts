import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import * as AuthActions from "app/store/auth/actions/auth.actions";
import {
  selectIsLoading,
  selectAuthError,
  selectAuthToken,
} from "app/store/auth/selectors/auth.selectors";
import { DialogComponent } from "app/components/dialog/dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  isLoading$: Observable<boolean>;
  error$: Observable<any>;
  token$: Observable<string>;

  constructor(
    private store: Store,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.isLoading$ = this.store.select(selectIsLoading);
    this.error$ = this.store.select(selectAuthError);
    this.token$ = this.store.select(selectAuthToken);
  }

  ngOnInit(): void {
    this.error$.subscribe((error) => {
      let message = "wrong credentials";
      console.log("error",error)
      if (error) {
        if (!error.status || error.status != 400) {
          message = "Server error";
        }
        this.dialog.open(DialogComponent, {
          width: "250px",
          data: { message, type: "error" },
        });
      }
    });

    this.token$.subscribe((token) => {
      console.log("token",token);
      if(token){
        this.router.navigate(["/dashboard"]);
      }
    });
  }

  onLogin(username: string, password: string) {
    this.store.dispatch(AuthActions.loginRequest({ username, password }));
  }
}
