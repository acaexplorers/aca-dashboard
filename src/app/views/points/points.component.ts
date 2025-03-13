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
  dataSource = new MatTableDataSource<StudentData>(); // Usamos un MatTableDataSource vacío
  pointsData$: Observable<any>; // Observable para los datos de puntos
  groupedPoints: any = {}; // Grouped points by username
  isLoading: boolean = false; // Indicador de carga
  error: string | null = null; // Mensaje de error

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Inicializar el observable para los datos de puntos
    this.pointsData$ = this.store.select(selectPointsData);

    this.fetchWeeklyData(); 
    console.log("this.pointsData$ 1", this.pointsData$);

    this.pointsData$.subscribe({
      next: (points) => {
        console.log("points", points);
        this.isLoading = false;
        this.error = null;
        this.groupPointsByUser(points.data); // Agrupar los puntos por usuario
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
    console.log("Selected week fetc pots:", this.selectedWeek);      
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
    this.groupedPoints = points.reduce((acc, points) => {
      const username = points.attributes?.legacy_username || "Unknown User";
      if (!acc[username]) {
        acc[username] = [];
      }
      acc[username].push(points.attributes || {});
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
