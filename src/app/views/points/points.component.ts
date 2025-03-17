import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { selectPointsData } from "app/store/points/points.selector"; // Asegúrate de que esta ruta sea correcta
import * as PointsActions from "app/store/points/actions/points.action"; // Asegúrate de que esta ruta sea correcta
import { formatDate } from "@angular/common";

export interface StudentData {
  student: string;
  level: number;
  habitAction: number;
  points: number;
  totalPoints: number;
  contributed: string;
  added: number;
  status: string;
  studyRate: number;
  daysStudied: number;
  streak: number;
  studied: number;
  max: number;
  maxLevel: number;
  activeDays: number;
  addedStreak: number;
  activeStreak: number;
  activeDaysStreak: string;
  }

@Component({
  selector: "app-points",
  templateUrl: "./points.component.html",
  styleUrls: ["./points.component.scss"],
})
export class PointsComponent implements OnInit {
  searchTerm: string = ""; // Search term for filtering
  filteredPoints: any[] = []; // Filtered points for table view
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
  daysOfWeek: Date[] = []; // Days in the selected week
  selectedWeek: Date = new Date(); // Semana seleccionada
  //dataSource = new MatTableDataSource<StudentData>(); // Usamos un MatTableDataSource vacío
  pointsData$: Observable<any>; // Observable para los datos de puntos
  groupedPoints: any = {}; // Grouped points by username
  isLoading: boolean = false; // Indicador de carga
  error: string | null = null; // Mensaje de error

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Inicializar el observable para los datos de puntos
    this.pointsData$ = this.store.select(selectPointsData);

    this.fetchWeeklyData(); 

    this.pointsData$.subscribe({
  next: (points) => {
    console.log("points", points); // Asegúrate de que hay datos aquí
    if (!points || !points.data || points.data.length === 0) {
      console.error("points.data está vacío o es undefined");
    } else {
      this.groupPointsByUser(points.data);
      this.updateFilteredData();
    }
    this.isLoading = false;
  },
  error: (err) => {
    this.isLoading = false;
    this.error = "Failed to fetch points data. Please try again.";
    console.error("Error fetching points data:", err);
  },
});

    this.calculateDaysOfWeek();
  }

  fetchWeeklyData(): void {
    const startOfWeek = this.getStartOfWeek(this.selectedWeek);
    const endOfWeek = this.getEndOfWeek(this.selectedWeek);
    const formattedStartDate = formatDate(startOfWeek, "yyyy-MM-dd", "en");
    const formattedEndDate = formatDate(endOfWeek, "yyyy-MM-dd", "en");
    
    this.isLoading = true;
    this.store.dispatch(
      PointsActions.loadPointsData({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      })
    );
  }

  // Update filtered data based on the view mode
  updateFilteredData(): void {
    this.filteredPoints = this.prepareTablePointsData();
  }
  
  // Prepare table data dynamically
  prepareTablePointsData(): any[] {
    const allRows = [];
    Object.keys(this.groupedPoints).forEach((username) => {
      this.groupedPoints[username].forEach((day: any) => {
        allRows.push({
          student: username|| "N/A", //**** */  name
          level: day.level || "N/A", //**** */  level
          habitAction: day.day_reported|| "N/A", //**** */ day_reported
          points: day.day_reported|| "N/A", //**** */ day_reported
          totalPoints: day.studied|| "N/A", //**** */ 
          contributed: "N/A",
          added: day.added|| "N/A", //**** */ 
          status: "N/A", //day.status || "N/A",
          studyRate: "N/A", //day.study_rate || "N/A",
          daysStudied: "N/A", //day.days_studied || "N/A",
          streak: "N/A", //day.streak || "N/A",
          max:"N/A", // day.max || "N/A",
          maxLevel: "N/A", //day.max_level || "N/A",
          activeDays:"N/A", // day.active_days || "N/A",
          addedStreak:"N/A", // day.added_streak || "N/A",
          activeStreak: "N/A", //day.active_streak || "N/A",
          activeDaysStreak: "N/A", //day.active_days_streak || "N/A"          
        });
      });
    });
    return allRows;
  }

  generateReport(): void {
    const startOfWeek = this.getStartOfWeek(this.selectedWeek);
    const endOfWeek = this.getEndOfWeek(this.selectedWeek);
    const formattedStartDate = formatDate(startOfWeek, "yyyy-MM-dd", "en");
    const formattedEndDate = formatDate(endOfWeek, "yyyy-MM-dd", "en");

    console.log("Generando reporte para la semana:", this.selectedWeek);
    this.isLoading = true; // Set loading state
    // Despachar la acción para generar el reporte
    this.store.dispatch(
      PointsActions.loadPointsData({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      })
    );

    console.log("Generating report for the week:", formattedStartDate, "to", formattedEndDate);
  }


  // Group reports by username
  groupPointsByUser(points: any[]): void {
    console.log("points", points);
    if (!points || !Array.isArray(points) || points.length === 0) {
      this.groupedPoints = {}; // O un valor por defecto
      console.log("points is empy", this.groupedPoints);
      return;
    }
    console.log("reports aqui groupPointsByUser", points);
    this.groupedPoints = points.reduce((acc, point) => {
      const username = point.attributes?.legacy_username || "Unknown User";
      if (!acc[username]) {
        acc[username] = [];
      }
      console.log("point , acc", point, acc);
      acc[username].push(point.attributes || {});
      return acc;
    }, {});
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

    onChangeWeek(event: Date): void {
      this.selectedWeek = event;
      this.calculateDaysOfWeek();
      console.log("this.selectedWeek 1", this.selectedWeek);
      this.fetchWeeklyData();
    }
}
