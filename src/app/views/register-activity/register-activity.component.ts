import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import {
  selectWeeklyReports,
  selectSubmitReportLoading,
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

  selectedIndex = Number(localStorage.getItem("selectedIndex")) ?? 6;
  daysCheckMarks: string[] = [];
  added = new FormControl("");
  studied = new FormControl("");
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
    this.loadingSubmit$ = this.store.select(selectSubmitReportLoading);
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
      this.added.setValue("");
      this.studied.setValue("");
    }

    localStorage.setItem("selectedIndex", this.selectedIndex.toString());
  }

  submitReport(): void {
    if (this.username) {
      const currentDate = this.getFormattedDate(
        this.getDay(this.selectedIndex)
      );
      const dataToSend = {
        studied: this.studied.value,
        added: this.added.value,
        legacy_username: this.username, // Use the stored username
        creation: this.getFormattedDate(new Date()),
        day_reported: currentDate,
      };

      this.store.dispatch(
        ReportsActions.submitUserReport({ report: { data: dataToSend } })
      );

      this.updateMemoryReports(
        currentDate,
        this.added.value,
        this.studied.value
      );

      this.snackBar.open("Report submitted successfully!", "OK", {
        duration: 2000,
      });
      this.openDialog();
    } else {
      this.snackBar.open("Error: Username not available.", "OK", {
        duration: 2000,
      });
    }
  }

  updateMemoryReports(
    day_reported: string,
    added: string,
    studied: string
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

  openDialog(): void {
    this.dialog.open(DialogComponent, {
      width: "250px",
      data: { message: "Activity registered successfully" },
    });
  }
}
