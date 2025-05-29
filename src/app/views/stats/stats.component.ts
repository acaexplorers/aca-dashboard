import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { selectGlobalReports } from "app/store/reports/selectors/reports.selectors";
import * as ReportsActions from "app/store/reports/actions/reports.actions";
import * as moment from 'moment';

@Component({
  selector: "app-stats",
  templateUrl: "./stats.component.html",
  styleUrls: ["./stats.component.scss"],
})
export class StatsComponent implements OnInit {
  viewMode: string = "cards";
  filteredStudents: any[] = [];
  filteredCardStudents: any[] = [];
  searchTerm: string = "";
  displayedColumns: string[] = [
    "name",
    "day",
    "addedOn",
    "studied",
    "added",
    "level",
  ];
  selectedWeek: Date = new Date();
  daysOfWeek: Date[] = [];
  userReports$: Observable<any>;
  groupedReports: any = {};
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.userReports$ = this.store.select(selectGlobalReports);
    this.fetchReports();

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

    this.calculateDaysOfWeek();
  }

  // Updated to use Wednesday-Tuesday week system
  fetchReports(): void {
    const range = this.getCustomWeekRange(this.selectedWeek);
    const formattedStartDate = moment(range.start).format('YYYY-MM-DD');
    const formattedEndDate = moment(range.end).format('YYYY-MM-DD');

    this.isLoading = true;
    this.store.dispatch(
      ReportsActions.loadGlobalReports({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      })
    );
  }

  // Updated to use Wednesday-Tuesday week system
  calculateDaysOfWeek(): void {
    const range = this.getCustomWeekRange(this.selectedWeek);
    this.daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
      this.daysOfWeek.push(moment(range.start).add(i, 'days').toDate());
    }
  }

  // Custom week range method (Wednesday to Tuesday)
  getCustomWeekRange(date: Date): { start: Date, end: Date } {
    const momentDate = moment(date);
    const dayOfWeek = momentDate.day();
    const daysFromWednesday = (dayOfWeek + 4) % 7;
    
    const wednesday = momentDate.clone().subtract(daysFromWednesday, 'days');
    const tuesday = wednesday.clone().add(6, 'days');
    
    return { start: wednesday.toDate(), end: tuesday.toDate() };
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

  updateFilteredData(): void {
    this.filteredStudents = this.prepareTableData();
    this.filteredCardStudents = this.prepareCardData();
    console.log("this.filteredCardStudents", this.filteredCardStudents);
  }

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
          const dayOfWeek = this.getDayFromDate(day.day_reported);
          const addedOnDay = this.getDayFromDate(day.creation);
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

  switchView(view: string): void {
    this.viewMode = view;
  }

  // Updated to handle week selector output
  onWeekChange(weekRange: {start: Date, end: Date}): void {
    this.selectedWeek = weekRange.start;
    this.calculateDaysOfWeek();
    this.fetchReports();
  }
}