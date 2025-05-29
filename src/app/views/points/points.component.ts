import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { StudentData } from "app/types/points.types";



@Component({
  selector: "app-points",
  templateUrl: "./points.component.html",
  styleUrls: ["./points.component.scss"],
})
export class PointsComponent implements OnInit {
  viewMode: string = "table"; // Default to table view (since this is primarily tabular data)
  filteredStudents: StudentData[] = [];
  filteredCardStudents: any[] = [];
  searchTerm: string = "";
  
  displayedColumns: string[] = [
    "student",
    "level",
    "habitAction", 
    "points",
    "totalPoints",
    "contributed",
    "added",
    "status",
    "studyRate",
    "daysStudied",
    "streak",
    "studied",
    "max",
    "maxLevel",
    "activeDays",
    "addedStreak",
    "activeStreak",
    "activeDaysStreak",
    "action",
  ];

  selectedWeek: Date = new Date();
  // pointsData$: Observable<any>; // Uncomment when you have the store
  allStudentsData: StudentData[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Uncomment when you have the store set up
    // this.pointsData$ = this.store.select(selectPointsData);
    
    this.loadPointsData();
    
    // Uncomment when you have the store
    // this.pointsData$.subscribe({
    //   next: (data) => {
    //     this.isLoading = false;
    //     this.error = null;
    //     this.processPointsData(data);
    //     this.updateFilteredData();
    //   },
    //   error: (err) => {
    //     this.isLoading = false;
    //     this.error = "Failed to fetch points data. Please try again.";
    //     console.error("Error fetching points:", err);
    //   },
    // });

    // For now, using mock data
    this.initializeMockData();
    this.updateFilteredData();
  }

  loadPointsData(): void {
    this.isLoading = true;
    
    // Uncomment when you have the store/API
    // const range = this.getCustomWeekRange(this.selectedWeek);
    // const startDate = moment(range.start).format('YYYY-MM-DD');
    // const endDate = moment(range.end).format('YYYY-MM-DD');
    // 
    // this.store.dispatch(
    //   PointsActions.loadPointsData({ startDate, endDate })
    // );

    // Mock loading delay
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  initializeMockData(): void {
    this.allStudentsData = [
      {
        student: "Deborah",
        level: 0,
        habitAction: 0,
        points: 218,
        totalPoints: 48802,
        contributed: "-",
        added: 1,
        status: "Active",
        studyRate: 52,
        daysStudied: 6,
        streak: 68,
        studied: 367,
        max: 91,
        maxLevel: 0,
        activeDays: 6,
        addedStreak: 1,
        activeStreak: 9,
        activeDaysStreak: "14 Days",
      },
      {
        student: "Teacher",
        level: 8,
        habitAction: 0,
        points: 187,
        totalPoints: 112051,
        contributed: "100 | 68.1",
        added: 2,
        status: "Active",
        studyRate: 23,
        daysStudied: 1,
        streak: 2,
        studied: 163,
        max: 163,
        maxLevel: 8,
        activeDays: 1,
        addedStreak: 1,
        activeStreak: 6,
        activeDaysStreak: "2 Days",
      },
      {
        student: "Arley",
        level: 2,
        habitAction: 0,
        points: 87,
        totalPoints: 441603,
        contributed: "31.9",
        added: 0,
        status: "Active",
        studyRate: 8,
        daysStudied: 1,
        streak: 11,
        studied: 58,
        max: 58,
        maxLevel: 2,
        activeDays: 1,
        addedStreak: 0,
        activeStreak: 4,
        activeDaysStreak: "6 Days",
      },
      {
        student: "Maria",
        level: 5,
        habitAction: 12,
        points: 345,
        totalPoints: 78934,
        contributed: "45.2",
        added: 3,
        status: "Active",
        studyRate: 78,
        daysStudied: 5,
        streak: 23,
        studied: 289,
        max: 120,
        maxLevel: 5,
        activeDays: 5,
        addedStreak: 2,
        activeStreak: 12,
        activeDaysStreak: "21 Days",
      },
    ];
  }

  updateFilteredData(): void {
    this.filteredStudents = [...this.allStudentsData];
    this.filteredCardStudents = this.prepareCardData();
  }

  prepareCardData(): any[] {
    return this.allStudentsData.map(student => ({
      name: student.student,
      level: student.level,
      points: student.points,
      totalPoints: student.totalPoints,
      status: student.status,
      stats: {
        studyRate: student.studyRate,
        daysStudied: student.daysStudied,
        streak: student.streak,
        studied: student.studied,
        activeDays: student.activeDays,
        activeDaysStreak: student.activeDaysStreak
      }
    }));
  }

  filterStudents(): void {
    if (this.searchTerm.trim() === "") {
      this.updateFilteredData();
    } else {
      this.filteredStudents = this.allStudentsData.filter((student) =>
        student.student.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.filteredCardStudents = this.prepareCardData().filter((student) =>
        student.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  switchView(view: string): void {
    this.viewMode = view;
  }

  onWeekChange(weekRange: {start: Date, end: Date}): void {
    this.selectedWeek = weekRange.start;
    this.loadPointsData();
  }

  generateAction(student: StudentData): void {
    console.log(`Generating action for ${student.student}`);
    // Implement your generate logic here
  }

  // Helper method for custom week range (same as stats component)
  getCustomWeekRange(date: Date): { start: Date, end: Date } {
    const momentDate = new Date(date);
    const dayOfWeek = momentDate.getDay();
    const daysFromWednesday = (dayOfWeek + 4) % 7;
    
    const wednesday = new Date(momentDate);
    wednesday.setDate(momentDate.getDate() - daysFromWednesday);
    
    const tuesday = new Date(wednesday);
    tuesday.setDate(wednesday.getDate() + 6);
    
    return { start: wednesday, end: tuesday };
  }
}