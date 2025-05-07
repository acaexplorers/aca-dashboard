import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, forkJoin, combineLatest, of} from "rxjs";
import {catchError, filter, take} from "rxjs/operators";
import { selectPointsData} from "app/store/points/points.selector"; 
import * as PointsActions from "app/store/points/actions/points.action"; 
import { formatDate } from "@angular/common";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { selectGlobalReports } from "app/store/reports/selectors/reports.selectors";
import * as ReportsActions from "app/store/reports/actions/reports.actions";

interface PointData {
  attributes: {
    legacy_username: string;
    studied: number;
    added: number;
    study_streak: number;
    added_streak: number;
    active_streak: number;
    active_days_streak: number;
    day_reported?: string;
  };
}

interface ReportData {
  attributes: {
    legacy_username: string;
    studied: number;
    added: number;
    day_reported: string;
  };
}

interface TableRow {
  student: string;
  points: number;
  totalPoints: number;
  added: number;
  studyRate: number;
  daysStudied: number;
  streak: number;
  studied: number;
  maxLevel: number;
  activeDays: number;
  addedStreak: number;
  activeStreak: number;
  activeDaysStreak: number;
}

interface StudentData {
  attributes: {
    legacy_username: string;
    day_reported: string;
    studied: number;
    added: number;
    study_streak: number;
    added_streak: number;
    active_streak: number;
    active_days_streak: number;
  };
}

interface CombinedUserData {
  pointsData: any[];
  reportsData: any[];
}

@Component({
  selector: "app-points",
  templateUrl: "./points.component.html",
  styleUrls: ["./points.component.scss"],
})

export class PointsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = [
    "student",
    "points",
    "totalPoints",
    "added",
    "studyRate",
    "daysStudied",
    "streak",
    "studied",
    "maxLevel",
    "activeDays",
    "addedStreak",
    "activeStreak",
    "activeDaysStreak",
    "action",
  ];

  
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  totalPages = 1;
  paginatedData: any[] = [];
  daysOfWeek: Date[] = [];
  minEndDate: Date;
  searchTerm: string = "";

  dataSource = new MatTableDataSource<TableRow>([]);
    
  selectedWeek: Date = new Date(); 
  pointsData$: Observable<any>; 
  globalReports$: Observable<any>;
  streaksData$: Observable<any>;
  groupedPoints: any = {}; 
  isLoading: boolean = false; 
  error: string | null = null; 
  filteredPoints: any[] = [];
  combinedGroupedData: { [username: string]: CombinedUserData } = {};

  constructor(
    private store: Store,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeData();
    this.setupDateRange();
    this.fetchCombinedData();
  

    this.pointsData$ = this.store.select(selectPointsData);
    this.globalReports$ = this.store.select(selectGlobalReports);
    
    // Suscripciones para debug
    this.pointsData$.subscribe(data => console.log('Datos de puntos:', data));
    this.globalReports$.subscribe(data => console.log('Datos de reports:', data));
    
    this.fetchCombinedData();
  }

  private initializeData(): void {
    this.pointsData$ = this.store.select(selectPointsData);
    this.globalReports$ = this.store.select(selectGlobalReports);
  }

  private setupDateRange(): void {
    const startOfWeek = this.getStartOfWeek(this.selectedWeek);
    this.minEndDate = new Date(startOfWeek);
    this.minEndDate.setDate(startOfWeek.getDate() + 6);
  }

  private isDateInCurrentWeek(dateString: string): boolean {
    try {
      const date = new Date(dateString);
      const startOfWeek = this.getStartOfWeek(this.selectedWeek);
      const endOfWeek = this.getEndOfWeek(this.selectedWeek);
      
      return date >= startOfWeek && date <= endOfWeek;
    } catch (e) {
      console.error('Error parsing date:', dateString);
      return false;
    }
  }

  startDateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    return date.getDay() === 3; // 3 = miércoles
  }

  endDateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    return date.getDay() === 2; // 2 = martes
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Métodos de filtrado
  applyFilter(): void {
    const filterValue = this.searchTerm.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Métodos para actualizar datos
  updateDataSource(): void {
    const tableData = this.prepareTablePointsData();
    console.log('Datos preparados para tabla:', tableData);

    this.dataSource.data = tableData;
    
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    
    this.cdr.detectChanges();
  }

  updateTableData(): void {
    const tableData = this.prepareTablePointsData();
    console.log('Datos para tabla:', tableData);
    
    this.dataSource.data = tableData;
    this.cdr.detectChanges();
  }

  // Métodos para obtener y procesar datos
  fetchCombinedData(): void {
    this.isLoading = true;
    
    const startDate = this.getFormattedStartDate();
    const endDate = this.getFormattedEndDate();

    console.log(`Fetching data for range: ${startDate} to ${endDate}`);

    this.store.dispatch(PointsActions.loadPointsData({ startDate, endDate }));
    this.store.dispatch(ReportsActions.loadGlobalReports({ startDate, endDate }));

    forkJoin({
      pointsData: this.pointsData$.pipe(
        filter(data => !!data?.data), // Filtramos datos nulos
        take(1), // Tomamos solo la primera emisión válida
        catchError(error => {
          console.error('Error en pointsData:', error);
          return of(null); // O un objeto vacío según tu necesidad
        })
      ),
      reportsData: this.globalReports$.pipe(
        filter(data => !!data?.data), // Filtramos datos nulos
        take(1), // Tomamos solo la primera emisión válida
        catchError(error => {
          console.error('Error en reportsData:', error);
          return of(null); // O un objeto vacío según tu necesidad
        })
      )
    }).subscribe({
      next: ({ pointsData, reportsData }) => {
        console.log('Datos combinados recibidos:', { pointsData, reportsData });
        this.processCombinedData(pointsData, reportsData);
      },
      error: (err) => {
        console.error('Error al combinar datos:', err);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private processCombinedData(pointsData: any, reportsData: any): void {
    // Verifica que los datos tengan la estructura esperada
    if (!pointsData?.data || !reportsData?.data) {
      console.error('Datos incompletos:', { pointsData, reportsData });
      this.combinedGroupedData = {};
      return;
    }

    const combined: { [username: string]: CombinedUserData } = {};

    // Procesar solo reportsData para studied y added
    reportsData.data.forEach((report: any) => {
      const username = report.attributes?.legacy_username || 'unknown';
      if (!combined[username]) {
        combined[username] = { pointsData: [], reportsData: [] };
      }
      
      combined[username].reportsData.push({
        studied: Number(report.attributes?.studied) || 0,
        added: Number(report.attributes?.added) || 0,
        day_reported: report.attributes?.day_reported || ''
      });
    });
  
    // Procesar pointsData para streaks (si es necesario)
    pointsData.data.forEach((point: any) => {
      const username = point.attributes?.legacy_username || 'unknown';
      if (!combined[username]) {
        combined[username] = { pointsData: [], reportsData: [] };
      }
 
      combined[username].pointsData.push({
        study_streak: Number(point.attributes?.study_streak) || 0,
        added_streak: Number(point.attributes?.added_streak) || 0,
        active_streak: Number(point.attributes?.active_streak) || 0,
        active_days_streak: Number(point.attributes?.active_days_streak) || 0
      });
    });
  
    this.combinedGroupedData = combined;
    this.updateTableData();
  }

  // Métodos para preparar datos para la tabla
  prepareTablePointsData(): TableRow [] {
    if (!this.combinedGroupedData || Object.keys(this.combinedGroupedData).length === 0) {
      console.warn('No hay datos combinados para mostrar');
      return [];
    }

    return Object.entries(this.combinedGroupedData)
      .map(([username, userData]) => {
        const reportsData = userData.reportsData || [];
        const pointsData = userData.pointsData || [];

        // Cálculos basados en reportsData (studied y added)
        const totalStudy = reportsData.reduce((sum: number, day: any) => sum + (day.studied || 0), 0);
        const studiedDays = reportsData.filter((day: any) => (day.studied || 0) > 0).length;
        const totalAdded = reportsData.reduce((sum: number, day: any) => sum + (day.added || 0), 0);
          
        // Obtiene streaks de pointsData
        const lastPointData = pointsData[pointsData.length - 1] || {};
        const totalPoints = lastPointData.totalPoints || 0;
        const maxStreak = lastPointData.study_streak || 0;
        const maxAddedStreak = lastPointData.added_streak || 0;
        const maxActiveStreak = lastPointData.active_streak || 0;
        const maxActiveDaysStreak = lastPointData.active_days_streak || 0;

        // Calculas semanales
        const multiplier = this.calculateMultiplier(pointsData);
        const studyRate = this.calculateStudyRate(totalStudy, studiedDays || 1);
        const weeklyPoints = parseFloat((multiplier * totalStudy).toFixed(2));

        return {
          student: username,
          points: weeklyPoints,
          totalPoints: totalPoints,
          added: totalAdded,
          studyRate: studyRate,
          daysStudied: studiedDays,
          streak: maxStreak,
          studied: totalStudy,
          maxLevel: this.calculateMaxLevel(pointsData),          
          activeDays: maxActiveDaysStreak,
          addedStreak: maxAddedStreak,
          activeStreak: maxActiveStreak,
          activeDaysStreak: maxActiveDaysStreak
        };
      })
      .filter((item): item is TableRow => item !== null);
  }

  private combineData(pointsData: any[], reportsData: any[]): { [username: string]: CombinedUserData } {
    const combined: { [username: string]: CombinedUserData } = {};
  
    // Procesar pointsData
    pointsData.forEach(point => {
      const username = point.attributes?.legacy_username || 'unknown';
      if (!combined[username]) {
        combined[username] = { pointsData: [], reportsData: [] };
      }
      combined[username].pointsData.push(this.processPoint(point));
    });
  
    // Procesar reportsData
    reportsData.forEach(report => {
      const username = report.attributes?.legacy_username || 'unknown';
      if (!combined[username]) {
        combined[username] = { pointsData: [], reportsData: [] };
      }
      combined[username].reportsData.push(this.processReport(report));
    });
  
    return combined;
  }

  private processPoint(point: any): any {
    return {
      ...point.attributes,
      studied: Number(point.attributes?.studied) || 0,
      added: Number(point.attributes?.added) || 0,
      study_streak: Number(point.attributes?.study_streak) || 0,
      added_streak: Number(point.attributes?.added_streak) || 0,
      active_streak: Number(point.attributes?.active_streak) || 0,
      active_days_streak: Number(point.attributes?.active_days_streak) || 0,
      day_reported: point.attributes?.day_reported || ''
    };
  }

  private processReport(report: any): any {
    return {
      ...report.attributes,
      studied: Number(report.attributes?.studied) || 0,
      added: Number(report.attributes?.added) || 0,
      day_reported: report.attributes?.day_reported || ''
    };
  }
  
  // Métodos auxiliares
  private groupPointsByUser(points: any[]): void {
    if (!points || !Array.isArray(points) || points.length === 0) {
      this.groupedPoints = {}; 
      return;
    }

    this.groupedPoints = points.reduce((acc, point) => {
      const username = point.attributes?.legacy_username || "Unknown User";
      if (!acc[username]) acc[username] = [];

      const exists = acc[username].some(item => item.day_reported === point.attributes.day_reported);
      
      if (!exists) {
        acc[username].push({
          ...point.attributes,
          studied: Number(point.attributes?.studied) || 0,
          added: Number(point.attributes?.added) || 0,
          study_streak: Number(point.attributes?.study_streak) || 0,
          added_streak: Number(point.attributes?.added_streak) || 0,
          active_streak: Number(point.attributes?.active_streak) || 0,
          active_days_streak: Number(point.attributes?.active_days_streak) || 0
        });
      }

      return acc;
    }, {});
  }

  // Métodos de cálculo
  private calculateMultiplier(studentData: any[]): number {
    const wasActiveLastWeek = this.checkIfActiveLastWeek(studentData);
    return wasActiveLastWeek ? 1.10 : 0.90;
  }

  private calculateStudyRate(totalStudy: number, studiedDays: number): number {
    if (studiedDays === 0) return 0;
    return parseFloat((totalStudy / studiedDays).toFixed(2));
  }

  private calculateStreakBonus(streak: number): number {
    return parseFloat(Math.pow(streak, 1.15).toFixed(2));
  }

  private calculateActiveStreakBonus(activeStreak: number): number {
    return parseFloat(Math.pow(activeStreak * 7, 1.15).toFixed(2));
  }

  private calculateActiveDaysStreakBonus(activeDaysStreak: number): number {
    return parseFloat(Math.pow(activeDaysStreak, 1.15).toFixed(2));
  }
  
  private calculateMaxLevel(studentData: any[]): number {
    // Implementa tu lógica para calcular el nivel máximo
    return 0;
  }

  private calculateAddedStreakBonus(addedStreak: number): number {
    return parseFloat(Math.pow(addedStreak, 1.15).toFixed(2));
  }

  private checkIfActiveLastWeek(studentData: any[]): boolean {
    const today = new Date();
    const startOfThisWeek = this.getStartOfWeek(today);
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    const endOfLastWeek = new Date(startOfThisWeek);
    endOfLastWeek.setDate(endOfLastWeek.getDate() - 1);
  
    const studiedDaysLastWeek = studentData.filter(day => {
      const reportedDate = new Date(day.day_reported);
      return reportedDate >= startOfLastWeek && 
             reportedDate <= endOfLastWeek && 
             (day.studied || 0) > 0;
    }).length;
  
    return studiedDaysLastWeek >= 6;
  }

  // Métodos de manejo de fechas
  private getFormattedStartDate(): string {
    const startOfWeek = this.getStartOfWeek(this.selectedWeek);
    return formatDate(startOfWeek, "yyyy-MM-dd", "en");
  }
  
  private getFormattedEndDate(): string {
    const endOfWeek = this.getEndOfWeek(this.selectedWeek);
    return formatDate(endOfWeek, "yyyy-MM-dd", "en");
  }

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
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(dateString);
    return daysOfWeek[date.getDay()];
  }

  // Métodos de validación de fechas
  isValidStartDate(date: Date | null): boolean {
    return date ? date.getDay() === 3 : false;
  }
  
  isValidEndDate(date: Date | null): boolean {
    return date ? date.getDay() === 2 : false;
  }
  
  getNextValidStartDate(currentDate: Date): Date {
    const date = new Date(currentDate);
    while (date.getDay() !== 3) {
      date.setDate(date.getDate() + 1);
    }
    return date;
  }
  
  getNextValidEndDate(startDate: Date): Date {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    return endDate;
  }
  
  onChangeWeekStart(event: Date): void {
    if (!this.isValidStartDate(event)) {
      event = this.getNextValidStartDate(event);
    }
    
    this.selectedWeek = event;
    this.minEndDate = this.getNextValidEndDate(event);
    this.calculateDaysOfWeek();  
    this.fetchCombinedData();
  }

  onChangeWeekEnd(event: Date): void {
    if (!this.isValidEndDate(event)) {
      event = this.getNearestValidEndDate(event);
    }
  
    let startDate = new Date(event);
    startDate.setDate(startDate.getDate() - 6);
    
    if (!this.isValidStartDate(startDate)) {
      startDate = this.getNextValidStartDate(startDate);
    }
  
    this.selectedWeek = startDate;
    this.minEndDate = event;
    this.calculateDaysOfWeek();
    this.fetchCombinedData();
  }
  
  getNearestValidEndDate(date: Date): Date {
    const newDate = new Date(date);
    while (newDate.getDay() !== 2) {
      newDate.setDate(newDate.getDate() + 1);
    }
    return newDate;
  }

  // Métodos de paginación
  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1; 
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredPoints.slice(startIndex, endIndex);
    this.totalItems = this.filteredPoints.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  }
    
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  // Método para generar reportes
  generateReport(): void {
    const startDate = this.getFormattedStartDate();
    const endDate = this.getFormattedEndDate();

    console.log("Generando reporte para:", startDate, "a", endDate);
    this.isLoading = true;
    this.store.dispatch(PointsActions.loadPointsData({ startDate, endDate }));
  }
}
