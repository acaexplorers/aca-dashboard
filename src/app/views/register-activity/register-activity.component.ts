import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { filter, Observable, take } from "rxjs";
import {
  selectWeeklyReports,
  selectIsSubmitLoading,
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
      "Wednesday",
      "Thursday", 
      "Friday",
      "Saturday",
      "Sunday",
      "Monday",
      "Tuesday",
    ],
    spanish: [
      "Miércoles",
      "Jueves",
      "Viernes", 
      "Sábado",
      "Domingo",
      "Lunes",
      "Martes",
    ],
  };

  selectedIndex = Number(localStorage.getItem("selectedIndex")) ?? this.getCurrentDayIndex();
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

  getCurrentDayIndex(): number {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // Convert to our system where Wednesday=0, Tuesday=6
    const ourWeekIndex = (dayOfWeek + 4) % 7;
    return ourWeekIndex;
  }

  getDay(selectedDayIndex: number): Date {
    const today = new Date();
    const todayIndex = this.getCurrentDayIndex();
    const dayDifference = selectedDayIndex - todayIndex;
    
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + dayDifference);
    return targetDate;
  }

  getWeekReports(username: string): void {
    const today = new Date();
    const todayIndex = this.getCurrentDayIndex();
    
    const wednesday = new Date(today);
    wednesday.setDate(today.getDate() - todayIndex);
    
    const tuesday = new Date(wednesday);
    tuesday.setDate(wednesday.getDate() + 6);
    
    const startDate = this.getFormattedDate(wednesday);
    const endDate = this.getFormattedDate(tuesday);

    this.store.dispatch(
      ReportsActions.loadWeeklyReports({ startDate, endDate, username })
    );
  }

  isFutureDay(dayIndex: number): boolean {
    const currentDayIndex = this.getCurrentDayIndex();
    return dayIndex > currentDayIndex;
  }

  isToday(dayIndex: number): boolean {
    const currentDayIndex = this.getCurrentDayIndex();
    return dayIndex === currentDayIndex;
  }

  getDayStatus(dayIndex: number): 'future' | 'selected' | 'complete' | 'partial' | 'not-done' {
    // Check if day is in the future - highest priority
    if (this.isFutureDay(dayIndex)) {
      return 'future';
    }
    
    // Check if day is currently selected
    if (this.selectedIndex === dayIndex) {
      return 'selected';
    }
  
    // Check report status for past/current days
    const dayDate = this.getFormattedDate(this.getDay(dayIndex));
    const report = this.userReports.find(r => r.day_reported === dayDate);
    
    if (!report) {
      return 'not-done';
    }
  
    // Check if both fields have values (complete)
    const hasAdded = report.added !== null && report.added > 0;
    const hasStudied = report.studied !== null && report.studied > 0;
  
    if (hasAdded && hasStudied) {
      return 'complete';  // Both fields filled
    }
    
    if (hasAdded || hasStudied) {
      return 'partial';   // Only one field filled
    }
    
    return 'not-done';    // No fields filled
  }

  getDayClass(dayIndex: number): string {
    const status = this.getDayStatus(dayIndex);
    return `day-${status}`;
  }

  getDayColor(dayIndex: number): string {
    const status = this.getDayStatus(dayIndex);
    
    switch (status) {
      case 'future':
        return '#e0e0e0';      // Gray
      case 'selected':
        return '#000000';      // Black
      case 'complete':
        return '#4caf50';      // Green
      case 'partial':
        return '#ff9800';      // Yellow/Orange
      case 'not-done':
        return '#f44336';      // Red
      default:
        return '#e0e0e0';
    }
  }

  isDayDisabled(dayIndex: number): boolean {
    return this.isFutureDay(dayIndex);
  }

  selectDay(dayIndex: number): void {
    if (this.isFutureDay(dayIndex)) {
      return;
    }
    
    this.selectedIndex = dayIndex;
    this.updateSelectedDay();
  }

  getDayTextColor(dayIndex: number): string {
    const status = this.getDayStatus(dayIndex);
    
    switch (status) {
      case 'future':
        return '#9e9e9e';      // Light gray text
      case 'selected':
        return '#ffffff';      // White text
      case 'complete':
        return '#ffffff';      // White text
      case 'partial':
        return '#ffffff';      // White text
      case 'not-done':
        return '#ffffff';      // White text
      default:
        return '#000000';
    }
  }

  getDayStatusText(dayIndex: number): string {
    const status = this.getDayStatus(dayIndex);
    
    switch (status) {
      case 'future':
        return 'Future day - not available';
      case 'selected':
        return 'Currently selected';
      case 'complete':
        return 'Report completed';
      case 'partial':
        return 'Report partially completed';
      case 'not-done':
        return 'No report submitted';
      default:
        return '';
    }
  }
  
  getFormattedDate(date: Date): string {
    return date.toLocaleDateString("en-CA"); // YYYY-MM-DD format
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
        
        // If successful, immediately update local state for color change
        if (!status.error) {
          this.updateMemoryReports(
            currentDate,
            Number(this.added.value),
            Number(this.studied.value)
          );
        }
        
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
