import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { filter, Observable, take } from "rxjs";
import {
  selectWeeklyReports,
  selectIsSubmitLoading,
  selectSubmitError,
  selectSubmitReportStatus,
} from "app/store/reports/selectors/reports.selectors";
import { selectAuthUsername } from "app/store/auth/selectors/auth.selectors";
import * as ReportsActions from "app/store/reports/actions/reports.actions";
import { DialogComponent } from "app/components/dialog/dialog.component";

@Component({
  selector: "app-register-activity",
  templateUrl: "./register-activity.component.html",
  styleUrls: ["./register-activity.component.scss"],
})
export class RegisterActivityComponent implements OnInit {
  daysReference = {
    english: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    spanish: [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ],
  };

  selectedIndex =
    Number(localStorage.getItem("selectedIndex")) ??
    (new Date().getDay() + 6) % 7;
  daysCheckMarks: string[] = [];
  added = new FormControl<number | null>(null);
  studied = new FormControl<number | null>(null);
  currentDate = "";
  userReports: any[] = []; // Local state for reports
  userReports$: Observable<any[]>; // Observable for weekly reports
  loadingSubmit$: Observable<boolean>; // Observable for submit report loading state
  username$: Observable<string | null>; // Observable for username
  private username: string | null = null; // Local state for username

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private store: Store
  ) {}

  ngOnInit(): void {
    // Select observables
    this.userReports$ = this.store.select(selectWeeklyReports);
    this.loadingSubmit$ = this.store.select(selectIsSubmitLoading);
    this.username$ = this.store.select(selectAuthUsername);

    // Fetch weekly reports
    this.username$.subscribe((username) => {
      if (username) {
        this.username = username;
        this.getWeekReports(username);
      }
    });

    // Subscribe to userReports$ and update local state
    this.userReports$.subscribe((reports) => {
      this.userReports = reports.map((report: any) => ({
        day_reported: report.attributes.day_reported,
        added: report.attributes.added,
        studied: report.attributes.studied,
      }));
      this.updateDaysCheckMarks();
      this.updateSelectedDay();
    });
  }

  getFormattedDate(date: Date): string {
    return date.toLocaleDateString("en-CA"); // YYYY-MM-DD format
  }

  getWeekReports(username: string): void {
    const date = new Date();
    const endDate = this.getFormattedDate(date);
    date.setDate(date.getDate() - 6);
    const startDate = this.getFormattedDate(date);

    this.store.dispatch(
      ReportsActions.loadWeeklyReports({ startDate, endDate, username })
    );
  }

  getDay(selectedDayIndex: number): Date {
    const today = new Date();
    const dayDifference = selectedDayIndex - 6;
    return new Date(today.setDate(today.getDate() + dayDifference));
  }

  updateDaysCheckMarks(): void {
    this.daysCheckMarks = this.userReports.map((report) => report.day_reported);
  }

  updateSelectedDay(): void {
    const currentDate = this.getFormattedDate(this.getDay(this.selectedIndex));
    this.currentDate = currentDate;

    const report = this.userReports.find(
      (r: any) => r.day_reported === currentDate
    );
    if (report) {
      this.added.setValue(report.added);
      this.studied.setValue(report.studied);
    } else {
      this.added.setValue(null);
      this.studied.setValue(null);
    }

    localStorage.setItem("selectedIndex", this.selectedIndex.toString());
  }

  submitReport(): void {
    if (!this.username) {
      this.snackBar.open("Error: Username not available.", "OK", {
        duration: 2000,
      });
      return;
    }

    const currentDate = this.getFormattedDate(this.getDay(this.selectedIndex));
    const dataToSend = {
      studied: Number(this.studied.value),
      added: Number(this.added.value),
      legacy_username: this.username,
      creation: this.getFormattedDate(new Date()),
      day_reported: currentDate,
    };

    this.store.dispatch(
      ReportsActions.submitUserReport({ report: dataToSend })
    );

    // Single subscription for both success/error
    this.store
      .select(selectSubmitReportStatus)
      .pipe(
        filter((status) => !status.loading),
        take(1)
      )
      .subscribe((status) => {
        this.snackBar.open(
          status.error
            ? `Error: I can't submit the report`
            : "Report submitted!",
          "OK",
          { duration: status.error ? 3000 : 2000 }
        );
        this.openDialog(status.error ? true : false);
      });
  }

  updateMemoryReports(
    day_reported: string,
    added: number,
    studied: number
  ): void {
    const existingIndex = this.userReports.findIndex(
      (report) => report.day_reported === day_reported
    );
    if (existingIndex !== -1) {
      this.userReports[existingIndex] = { day_reported, added, studied };
    } else {
      this.userReports.push({ day_reported, added, studied });
    }
    this.updateDaysCheckMarks();
  }

  openDialog(error = false): void {
    if (!error) {
      this.dialog.open(DialogComponent, {
        data: {
          message: "Activity registered successfully",
          type: "success",
        },
      });
    }
  }
}
