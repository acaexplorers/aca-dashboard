import { Component } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
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
export class PointsComponent {
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
  dataSource = new MatTableDataSource([
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
  ]);

  selectedWeek: Date = new Date(); // Selected week from date picker

  constructor() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase(); // Filter the data
  }

  fetchWeeklyData(): void {
    const startOfWeek = this.getStartOfWeek(this.selectedWeek);
    const endOfWeek = this.getEndOfWeek(this.selectedWeek);
    const formattedStartDate = formatDate(startOfWeek, "yyyy-MM-dd", "en");
    const formattedEndDate = formatDate(endOfWeek, "yyyy-MM-dd", "en");

    // Aquí puedes agregar la lógica para obtener los datos de la semana seleccionada
    console.log("Fetching data from:", formattedStartDate, "to", formattedEndDate);

    // Ejemplo: Filtrar los datos existentes (simulación)
    const filteredData = this.dataSource.data.filter((item) => {
      // Aquí puedes agregar la lógica de filtrado basada en la semana seleccionada
      return true; // Cambia esto según tu lógica
    });

    this.dataSource.data = filteredData; // Actualiza la tabla con los datos filtrados
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
}