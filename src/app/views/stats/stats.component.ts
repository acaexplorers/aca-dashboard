import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, Subject, combineLatest, of } from "rxjs";
import { map, startWith, takeUntil, catchError } from "rxjs/operators";
import { selectGlobalReports } from "app/store/reports/selectors/reports.selectors";
import * as ReportsActions from "app/store/reports/actions/reports.actions";
import * as moment from 'moment';

@Component({
  selector: "app-stats",
  templateUrl: "./stats.component.html",
  styleUrls: ["./stats.component.scss"],
})
export class StatsComponent implements OnInit, OnDestroy {
  viewMode: string = "cards";
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

  // Subject for cleanup
  private destroy$ = new Subject<void>();
  
  // Subject for search term
  private searchTermSubject = new Subject<string>();

  // Store observables
  userReports$ = this.store.select(selectGlobalReports);
  
  // Loading and error observables
  isLoading$ = this.userReports$.pipe(
    map(() => false),
    startWith(true),
    catchError(() => of(false))
  );
  
  error$ = this.userReports$.pipe(
    map(() => null),
    catchError(err => of("Failed to fetch reports. Please try again."))
  );

  // Filtered data observables
  filteredStudents$ = combineLatest([
    this.userReports$,
    this.searchTermSubject.pipe(startWith(''))
  ]).pipe(
    map(([reports, searchTerm]) => {
      if (!reports?.data) return [];
      const tableData = this.prepareTableData(reports.data);
      return searchTerm.trim() ? 
        tableData.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())) :
        tableData;
    }),
    takeUntil(this.destroy$)
  );
  
  filteredCardStudents$ = combineLatest([
    this.userReports$,
    this.searchTermSubject.pipe(startWith(''))
  ]).pipe(
    map(([reports, searchTerm]) => {
      if (!reports?.data) return [];
      const cardData = this.prepareCardData(reports.data);
      return searchTerm.trim() ? 
        cardData.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())) :
        cardData;
    }),
    takeUntil(this.destroy$)
  );

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.fetchReports();
    this.calculateDaysOfWeek();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Updated to use Wednesday-Tuesday week system
  fetchReports(): void {
    const range = this.getCustomWeekRange(this.selectedWeek);
    const formattedStartDate = moment(range.start).format('YYYY-MM-DD');
    const formattedEndDate = moment(range.end).format('YYYY-MM-DD');

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

  groupReportsByUser(reports: any[]): any {
    return reports.reduce((acc, report) => {
      const username = report.attributes?.legacy_username || "Unknown User";
      if (!acc[username]) {
        acc[username] = [];
      }
      acc[username].push(report.attributes || {});
      return acc;
    }, {});
  }

  prepareTableData(reports: any[]): any[] {
    const groupedReports = this.groupReportsByUser(reports);
    const allRows = [];
    Object.keys(groupedReports).forEach((username) => {
      groupedReports[username].forEach((day: any) => {
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

  prepareCardData(reports: any[]): any[] {
    const groupedReports = this.groupReportsByUser(reports);
    return Object.keys(groupedReports).map((username) => {
      const totalStudied = groupedReports[username].reduce(
        (acc: number, day: any) => acc + day.studied,
        0
      );
      const totalAdded = groupedReports[username].reduce(
        (acc: number, day: any) => acc + day.added,
        0
      );

      const daysWithAdditionalFields = groupedReports[username].map(
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
    this.searchTermSubject.next(this.searchTerm);
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