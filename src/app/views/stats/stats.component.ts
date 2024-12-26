import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { selectGlobalReports } from "app/store/reports/selectors/reports.selectors";
import * as ReportsActions from "app/store/reports/actions/reports.actions";
import { formatDate } from "@angular/common";

@Component({
  selector: "app-stats",
  templateUrl: "./stats.component.html",
  styleUrls: ["./stats.component.scss"],
})
export class StatsComponent implements OnInit {
  viewMode: string = "cards"; // Default to card view
  filteredStudents: any[] = []; // Filtered students for table view
  filteredCardStudents: any[] = []; // Filtered students for card view
  searchTerm: string = ""; // Search term for filtering
  displayedColumns: string[] = [
    "name",
    "day",
    "addedOn",
    "studied",
    "added",
    "level",
  ]; // Table columns
  selectedWeek: Date = new Date(); // Selected week from date picker
  daysOfWeek: Date[] = []; // Days in the selected week
  userReports$: Observable<any>; // Reports from the store
  groupedReports: any = {}; // Grouped reports by username
  isLoading: boolean = false; // Loading indicator
  error: string | null = null; // Error message

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Initialize userReports observable
    this.userReports$ = this.store.select(selectGlobalReports);

    // Fetch reports for the current week
    this.fetchReports();

    // Subscribe to userReports$ and process the data
    this.userReports$.subscribe({
      next: (reports) => {
        console.log("reports", reports);
        this.isLoading = false;
        this.error = null;
        this.groupReportsByUser(reports.data);
        this.updateFilteredData();
      },
      error: (err) => {
        this.isLoading = false;
        this.error = "Failed to fetch reports. Please try again.";
        console.error("Error fetching reports:", err);
      },
    });

    // Calculate days of the current week
    this.calculateDaysOfWeek();
  }

  // Fetch reports based on the selected week
  fetchReports(): void {
    const startOfWeek = this.getStartOfWeek(this.selectedWeek);
    const endOfWeek = this.getEndOfWeek(this.selectedWeek);
    const formattedStartDate = formatDate(startOfWeek, "yyyy-MM-dd", "en");
    const formattedEndDate = formatDate(endOfWeek, "yyyy-MM-dd", "en");

    this.isLoading = true; // Set loading state
    this.store.dispatch(
      ReportsActions.loadGlobalReports({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      })
    );
  }

  // Calculate the start and end of the week for the selected date
  calculateDaysOfWeek(): void {
    const startOfWeek = this.getStartOfWeek(this.selectedWeek);
    this.daysOfWeek = Array.from(
      { length: 7 },
      (_, i) => new Date(startOfWeek.getTime() + i * 24 * 60 * 60 * 1000)
    );
  }

  getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  }

  getEndOfWeek(date: Date): Date {
    const startOfWeek = this.getStartOfWeek(date);
    return new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);
  }

  getDayFromDate(dateString: string): string {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date(dateString);
    return daysOfWeek[date.getDay()];
  }

  // Group reports by username
  groupReportsByUser(reports: any[]): void {
    this.groupedReports = reports.reduce((acc, report) => {
      const username = report.attributes?.legacy_username || "Unknown User";
      if (!acc[username]) {
        acc[username] = [];
      }
      acc[username].push(report.attributes || {});
      return acc;
    }, {});
  }

  // Update filtered data based on the view mode
  updateFilteredData(): void {
    this.filteredStudents = this.prepareTableData();
    this.filteredCardStudents = this.prepareCardData();
    console.log("this.filteredCardStudents", this.filteredCardStudents);
  }

  // Prepare table data dynamically
  prepareTableData(): any[] {
    const allRows = [];
    Object.keys(this.groupedReports).forEach((username) => {
      this.groupedReports[username].forEach((day: any) => {
        allRows.push({
          name: username,
          day: day.day_reported,
          studied: day.studied,
          added: day.added,
          level: day.level || "N/A",
          addedOn: day.day_reported,
        });
      });
    });
    return allRows;
  }

  // Prepare card data dynamically
  prepareCardData(): any[] {
    return Object.keys(this.groupedReports).map((username) => {
      const totalStudied = this.groupedReports[username].reduce(
        (acc: number, day: any) => acc + day.studied,
        0
      );
      const totalAdded = this.groupedReports[username].reduce(
        (acc: number, day: any) => acc + day.added,
        0
      );

      const daysWithAdditionalFields = this.groupedReports[username].map(
        (day: any) => {
          const dayOfWeek = this.getDayFromDate(day.day_reported); // Calculate day
          const addedOnDay = this.getDayFromDate(day.creation); // Calculate addedOn
          return {
            ...day,
            day: dayOfWeek,
            addedOn: addedOnDay,
          };
        }
      );

      return {
        name: username,
        totalStudied,
        totalAdded,
        days: daysWithAdditionalFields,
      };
    });
  }

  // Filter students based on search term
  filterStudents(): void {
    if (this.searchTerm.trim() === "") {
      this.updateFilteredData();
    } else {
      this.filteredStudents = this.prepareTableData().filter((student) =>
        student.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.filteredCardStudents = this.prepareCardData().filter((student) =>
        student.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  // Switch between table and card views
  switchView(view: string): void {
    this.viewMode = view;
  }

  // Handle week change
  onWeekChange(event: Date): void {
    this.selectedWeek = event;
    this.calculateDaysOfWeek();
    this.fetchReports();
  }
}
