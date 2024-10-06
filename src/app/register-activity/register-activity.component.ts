import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
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
  userReports: any[] = [];

  constructor(public dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getWeekReports();
  }

  getFormattedDate(date: Date): string {
    return date.toLocaleDateString("en-CA"); // YYYY-MM-DD format
  }

  getWeekReports(): void {
    // Mock user report retrieval
    const mockUserReports = [
      { day_reported: "2023-10-01", added: "2", studied: "3" },
      { day_reported: "2023-10-02", added: "4", studied: "5" },
    ];

    this.userReports = mockUserReports;
    this.updateMemoryReports();
  }

  updateMemoryReports(): void {
    const reportsReady = this.userReports.map((report) => report.day_reported);
    this.daysCheckMarks = reportsReady;
  }

  getDay(selectedDayIndex: number): Date {
    const today = new Date();
    const dayDifference = selectedDayIndex - 6;
    return new Date(today.setDate(today.getDate() + dayDifference));
  }

  submitReport(): void {
    const currentDate = this.getFormattedDate(this.getDay(this.selectedIndex));
    const dataToSend = {
      studied: this.studied.value,
      added: this.added.value,
      day_reported: currentDate,
    };

    // Simulating API call success
    this.snackBar.open("Report submitted successfully!", "OK", {
      duration: 2000,
    });
    this.openDialog();

    // Update local reports memory
    this.updateMemoryReports();
  }

  openDialog(): void {
    this.dialog.open(DialogComponent, {
      width: "250px",
      data: { message: "Activity registered successfully" },
    });
  }
}
