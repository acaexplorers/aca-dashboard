import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { selectPointsData } from "app/store/points/selectors/points.selector"; // Asegúrate de que esta ruta sea correcta
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
  dataSource = new MatTableDataSource<StudentData>(); // Usamos un MatTableDataSource vacío
  selectedWeek: Date = new Date(); // Semana seleccionada
  pointsData$: Observable<any>; // Observable para los datos de puntos
  isLoading: boolean = false; // Indicador de carga
  error: string | null = null; // Mensaje de error

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Inicializar el observable para los datos de puntos
    this.pointsData$ = this.store.select(selectPointsData);

    this.fetchWeeklyData(); 

    this.pointsData$.subscribe({
      next: (data) => {
        console.log("Points Data:", data);
        this.isLoading = false;
        this.error = null;
        this.dataSource.data = data; // Actualizar la tabla con los datos recibidos
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
    this.error = null;
    this.store.dispatch(
      PointsActions.loadPointsData({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      })
    );
  }

  generateReport(): void {
    const startOfWeek = this.getStartOfWeek(this.selectedWeek);
    const endOfWeek = this.getEndOfWeek(this.selectedWeek);
    const formattedStartDate = formatDate(startOfWeek, "yyyy-MM-dd", "en");
    const formattedEndDate = formatDate(endOfWeek, "yyyy-MM-dd", "en");

    // Despachar la acción para generar el reporte
    this.store.dispatch(
      PointsActions.generatePointsReport({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      })
    );

    console.log("Generating report for the week:", formattedStartDate, "to", formattedEndDate);
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
}
