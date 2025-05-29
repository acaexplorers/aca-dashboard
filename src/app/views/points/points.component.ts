import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
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
export class PointsComponent implements OnInit {
  viewMode: string = "table";
  filteredStudents: CombinedStudentData[] = [];
  filteredCardStudents: any[] = [];
  searchTerm: string = "";

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

  selectedWeek: Date = new Date();

  // Store observables
  allStudentsData$: Observable<CombinedStudentData[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store, private dialog: MatDialog) {
    // Initialize observables
    this.allStudentsData$ = this.store.select(selectStudentsWithPoints);
    this.isLoading$ = this.store.select(selectPointsLoading);
    this.error$ = this.store.select(selectPointsError);
  }

  ngOnInit(): void {
    this.loadPointsData();

    // Subscribe to data changes
    this.allStudentsData$.subscribe((students) => {
      this.filteredStudents = [...students];
      this.filteredCardStudents = this.prepareCardData(students);
    });
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
    this.allStudentsData$.subscribe((allStudents) => {
      if (this.searchTerm.trim() === "") {
        this.filteredStudents = [...allStudents];
        this.filteredCardStudents = this.prepareCardData(allStudents);
      } else {
        this.filteredStudents = allStudents.filter((student) =>
          student.username.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
        this.filteredCardStudents = this.prepareCardData(this.filteredStudents);
      }
    });
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
  calculatePoints(student: CombinedStudentData): void {
    if (student.pointsBreakdown) {
      const breakdownText = this.getPointsBreakdownText(
        student.pointsBreakdown,
        student.username
      );
      alert(breakdownText);
    } else {
      alert(`No breakdown available for ${student.username}`);
    }
  }

  /**
   * Recalculate all students' points
   */
  recalculateAllPoints(): void {
    this.store.dispatch(PointsActions.recalculatePoints());
    console.log("Points recalculation triggered!");
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
