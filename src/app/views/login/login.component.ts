import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import * as AuthActions from "app/store/auth/actions/auth.actions";
import {
  selectIsLoading,
  selectAuthError,
} from "app/store/auth/selectors/auth.selectors";
import { DialogComponent } from "app/components/dialog/dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  isLoading$: Observable<boolean>;
  error$: Observable<any>;

  constructor(private store: Store, public dialog: MatDialog) {
    this.isLoading$ = this.store.select(selectIsLoading);
    this.error$ = this.store.select(selectAuthError);
  }

  ngOnInit(): void {
    this.error$.subscribe((error) => {
      let message = "wrong credentials";
      if (!error.status || error.status != 400) {
        message = "Server error";
      }

      if (error) {
        this.dialog.open(DialogComponent, {
          width: "250px",
          data: { message, type: "error" },
        });
      }
    });
  }

  onLogin(username: string, password: string) {
    // Dispatch the loginRequest action with the username and password
    this.store.dispatch(AuthActions.loginRequest({ username, password }));
  }
}
