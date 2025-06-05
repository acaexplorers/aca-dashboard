import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, Subject, combineLatest, BehaviorSubject } from "rxjs";
import { takeUntil, map, startWith, distinctUntilChanged, debounceTime } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import * as PointsActions from "app/store/points/actions/points.actions";
import {
  selectStudentsWithPoints,
  selectPointsLoading,
  selectPointsError,
} from "app/store/points/selectors/points.selectors";
import { CombinedStudentData } from "app/types/points.types";

@Component({
  selector: "app-points",
  templateUrl: "./points.component.html",
  styleUrls: ["./points.component.scss"],
})
export class PointsComponent implements OnInit, OnDestroy {
  // Component state
  viewMode: string = "table";
  searchTerm: string = "";
  selectedWeek: Date = new Date();

  // Table configuration
  displayedColumns: string[] = [
    "username",
    "studyRate",
    "studiedDays",
    "totalAdded",
    "studyStreak",
    "addedStreak",
    "activeStreak",
    "activeDaysStreak",
    "points",
    "action",
  ];

  // Store observables
  allStudentsData$: Observable<CombinedStudentData[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;

  // Derived observables for filtered data
  filteredStudents$: Observable<CombinedStudentData[]>;
  filteredCardStudents$: Observable<any[]>;

  // Use BehaviorSubject for better state management
  private searchTermSubject = new BehaviorSubject<string>("");

  // Subject for component cleanup
  private destroy$ = new Subject<void>();

  constructor(private store: Store, private dialog: MatDialog) {
    // Initialize store observables
    this.allStudentsData$ = this.store.select(selectStudentsWithPoints);
    this.isLoading$ = this.store.select(selectPointsLoading);
    this.error$ = this.store.select(selectPointsError);

    // Create filtered data observables
    this.setupFilteredData();
  }

  ngOnInit(): void {
    this.loadPointsData();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.destroy$.next();
    this.destroy$.complete();
    this.searchTermSubject.complete();
  }

  private setupFilteredData(): void {
    // Combine students data with search term with proper debouncing
    this.filteredStudents$ = combineLatest([
      this.allStudentsData$,
      this.searchTermSubject.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        startWith("")
      ),
    ]).pipe(
      map(([students, searchTerm]) => {
        if (!searchTerm.trim()) {
          return students || [];
        }
        return (students || []).filter((student) =>
          student.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }),
      takeUntil(this.destroy$)
    );

    // Create card data from filtered students
    this.filteredCardStudents$ = this.filteredStudents$.pipe(
      map((students) => this.prepareCardData(students)),
      takeUntil(this.destroy$)
    );
  }

  loadPointsData(): void {
    const range = this.getCustomWeekRange(this.selectedWeek);
    const startDate = this.formatDate(range.start);
    const endDate = this.formatDate(range.end);

    this.store.dispatch(PointsActions.loadPointsData({ startDate, endDate }));
  }

  prepareCardData(students: CombinedStudentData[]): any[] {
    return students.map((student) => ({
      name: student.username,
      points: student.points,
      stats: {
        studyRate: student.studyRate,
        studiedDays: student.studiedDays,
        totalStudy: student.totalStudy,
        totalAdded: student.totalAdded,
        studyStreak: student.studyStreak,
        addedStreak: student.addedStreak,
        activeStreak: student.activeStreak,
        activeDaysStreak: student.activeDaysStreak,
      },
    }));
  }

  filterStudents(): void {
    // Use the BehaviorSubject to emit the new search term
    this.searchTermSubject.next(this.searchTerm);
  }

  switchView(view: string): void {
    this.viewMode = view;
  }

  onWeekChange(weekRange: { start: Date; end: Date }): void {
    this.selectedWeek = weekRange.start;
    this.loadPointsData();
  }

  /**
   * Show points breakdown for a student
   */
  calculatePoints(student: CombinedStudentData | any): void {
    // Handle both table and card data formats
    const studentData = student.username
      ? student
      : {
          username: student.name,
          pointsBreakdown: student.pointsBreakdown,
        };

    if (studentData.pointsBreakdown) {
      const breakdownText = this.getPointsBreakdownText(
        studentData.pointsBreakdown,
        studentData.username || studentData.name
      );
      alert(breakdownText);
    } else {
      alert(
        `No breakdown available for ${studentData.username || studentData.name}`
      );
    }
  }

  /**
   * Recalculate all students' points
   */
  recalculateAllPoints(): void {
    this.store.dispatch(PointsActions.recalculatePoints());
    console.log("Points recalculation triggered!");
  }

  trackByUsername(index: number, student: any): string {
    return student.username || student.name;
  }

  /**
   * Format points breakdown for display
   */
  private getPointsBreakdownText(breakdown: any, studentName: string): string {
    return `
      Points Calculation for ${studentName}:

      • Multiplier: ${breakdown.multiplier} ${
      breakdown.multiplier === 1.1 ? "(Active Week)" : "(Inactive Week)"
    }
      • Study Rate: ${breakdown.studyRate}
      • Total Added: ${breakdown.totalAdded}
      • Streak Bonus: ${breakdown.streakBonus}
      • Added Streak Bonus: ${breakdown.addedStreakBonus}
      • Active Streak Bonus: ${breakdown.activeStreakBonus}
      • Active Days Streak Bonus: ${breakdown.activeDaysStreakBonus}

      Formula: (${breakdown.multiplier} × ${breakdown.studyRate}) + ${
      breakdown.totalAdded
    } + ${breakdown.streakBonus} + ${breakdown.addedStreakBonus} + ${
      breakdown.activeStreakBonus
    } + ${breakdown.activeDaysStreakBonus}

      Total Points: ${breakdown.totalPoints}
          `.trim();
  }

  /**
   * Helper methods
   */
  private getCustomWeekRange(date: Date): { start: Date; end: Date } {
    const momentDate = new Date(date);
    const dayOfWeek = momentDate.getDay();
    const daysFromWednesday = (dayOfWeek + 4) % 7;

    const wednesday = new Date(momentDate);
    wednesday.setDate(momentDate.getDate() - daysFromWednesday);

    const tuesday = new Date(wednesday);
    tuesday.setDate(wednesday.getDate() + 6);

    return { start: wednesday, end: tuesday };
  }

  private formatDate(date: Date): string {
    return date.toISOString().split("T")[0]; // YYYY-MM-DD format
  }
}