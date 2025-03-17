import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { PointsService } from 'app/services/points.service';
import { formatDate } from '@angular/common';
import * as PointsActions from 'app/store/points/actions/points.action';

@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.scss'],
})
export class PointsComponent implements OnInit {
  displayedColumns: string[] = [
    'student', 'level', 'habitAction', 'points', 'totalPoints', 'contributed', 'added', 'status', 'studyRate', 'daysStudied', 'streak', 'studied', 'max', 'maxLevel', 'activeDays', 'addedStreak', 'activeStreak', 'activeDaysStreak', 'action'
  ];
  dataSource = new MatTableDataSource<any>();
  isLoading: boolean = false;
  error: string | null = null;
  startDate: string = '';
  endDate: string = '';
  selectedWeek: Date = new Date();
  groupedPoints: { [key: string]: any[] } = {};
  viewMode: 'table' | 'cards' = 'table'; // Vista predeterminada: tabla

  constructor(private store: Store, private pointsService: PointsService) {}

  ngOnInit(): void {
    this.fetchWeeklyData();
  }

  onChangeWeek(selectedDate: Date): void {
    const startDate = new Date(selectedDate);
    const endDate = new Date(selectedDate);
    endDate.setDate(startDate.getDate() + 6);

    this.startDate = startDate.toISOString().split('T')[0];
    this.endDate = endDate.toISOString().split('T')[0];

    this.fetchWeeklyData();
  }

  fetchWeeklyData(): void {
    const username = 'username'; // Reemplaza con el nombre de usuario adecuado
    this.isLoading = true;

    this.pointsService.getWeeklyPointsReports(this.startDate, this.endDate, username).subscribe(
      (response: any) => { // Asegúrate de que response tenga la propiedad 'data'
        this.dataSource.data = response.data; // Asignar los datos a dataSource
        this.isLoading = false;
      },
      (error) => {
        this.error = 'Error al cargar los datos';
        this.isLoading = false;
        console.error('Error fetching weekly data:', error);
      }
    );
  }

  generateReport(): void {
    const startOfWeek = this.getStartOfWeek(this.selectedWeek);
    const endOfWeek = this.getEndOfWeek(this.selectedWeek);
    const formattedStartDate = formatDate(startOfWeek, "yyyy-MM-dd", "en");
    const formattedEndDate = formatDate(endOfWeek, "yyyy-MM-dd", "en");

    console.log("Generando reporte para la semana:", this.selectedWeek);
    this.isLoading = true;

    this.store.dispatch(
      PointsActions.loadPointsData({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      })
    );

    console.log("Generating report for the week:", formattedStartDate, "to", formattedEndDate);
  }

  groupPointsByUser(points: any[]): void {
    console.log("points", points);
    if (!points || !Array.isArray(points) || points.length === 0) {
      this.groupedPoints = {};
      console.log("points is empty", this.groupedPoints);
      return;
    }
    this.groupedPoints = points.reduce((acc, point) => {
      const username = point.attributes?.legacy_username || "Unknown User";
      if (!acc[username]) {
        acc[username] = [];
      }
      acc[username].push(point.attributes || {});
      return acc;
    }, {});
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