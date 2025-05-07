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
    if (!dateString) return false;

    try {
      // Normalizar fecha (eliminar hora/minutos/segundos)
      const inputDate = new Date(dateString);
      inputDate.setHours(0, 0, 0, 0);
      
      const startOfWeek = new Date(this.getStartOfWeek(this.selectedWeek));
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(this.getEndOfWeek(this.selectedWeek));
      endOfWeek.setHours(23, 59, 59, 999);
      
      return inputDate >= startOfWeek && inputDate <= endOfWeek;
    } catch (e) {
      console.error('Error validando fecha:', dateString, e);
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

    this.dataSource.data = this.prepareTablePointsData();
    
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    
    this.cdr.detectChanges();
  }

  updateTableData(): void {
    const tableData = this.prepareTablePointsData();
    console.log('Datos para tabla:', tableData);
    
    this.dataSource = new MatTableDataSource<TableRow>(tableData);
  
     // Configurar paginador si existe
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

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
     // Preprocesamiento básico de los datos
  const processedPoints = pointsData.data.map(point => ({
    attributes: {
      legacy_username: point.attributes?.legacy_username,
      study_streak: Number(point.attributes?.study_streak) || 0,
      added_streak: Number(point.attributes?.added_streak) || 0,
      active_streak: Number(point.attributes?.active_streak) || 0,
      active_days_streak: Number(point.attributes?.active_days_streak) || 0
    }
  }));

  const processedReports = reportsData.data.map(report => ({
    attributes: {
      legacy_username: report.attributes?.legacy_username,
      studied: Number(report.attributes?.studied) || 0,
      added: Number(report.attributes?.added) || 0,
      day_reported: report.attributes?.day_reported || ''
    }
  }));

  // Usar EXCLUSIVAMENTE combineData para la lógica de combinación
  this.combinedGroupedData = this.combineData(processedPoints, processedReports);
  this.updateTableData();
}

  // Métodos para preparar datos para la tabla
  prepareTablePointsData(): TableRow [] {
    if (!this.combinedGroupedData || Object.keys(this.combinedGroupedData).length === 0) {
      console.warn('No hay datos combinados para mostrar');
      return [];
    }

    const tableData: TableRow[] = [];

    Object.entries(this.combinedGroupedData).forEach(([username, userData]) => {
      try {
        const reportsData = userData.reportsData || [];
        const pointsData = userData.pointsData || [];
  
        // 1. Cálculo de DATOS SEMANALES (última semana)
        const weeklyData = reportsData.filter(report => 
          this.isDateInCurrentWeek(report.day_reported)
        );
        
        const weeklyStudy = weeklyData.reduce((sum, day) => sum + (day.studied || 0), 0);
        const weeklyAdded = weeklyData.reduce((sum, day) => sum + (day.added || 0), 0);
        const studiedDays = weeklyData.filter(day => (day.studied || 0) > 0).length;

        // 2. Cálculo de DATOS ACUMULADOS (totales históricos)
        const totalStudy = reportsData.reduce((sum, day) => sum + (day.studied || 0), 0);
        const totalAdded = reportsData.reduce((sum, day) => sum + (day.added || 0), 0);

        // 3. Obtener streaks (del último registro)
        const lastPointData = pointsData[pointsData.length - 1] || {};
        const maxStreak = lastPointData.study_streak || 0;
        const maxAddedStreak = lastPointData.added_streak || 0;
        const maxActiveStreak = lastPointData.active_streak || 0;
        const maxActiveDaysStreak = lastPointData.active_days_streak || 0;

       // 4. Cálculos según fórmula del PDF
        const streakBonus = this.calculateStreakBonus(maxStreak);
        const addedStreakBonus = this.calculateAddedStreakBonus(maxAddedStreak);
        const activeStreakBonus = this.calculateActiveStreakBonus(maxActiveStreak);
        const activeDaysStreakBonus = this.calculateActiveDaysStreakBonus(maxActiveDaysStreak);
        const lastPoint = pointsData[pointsData.length - 1] || {};
        
        // 5. Aplicar fórmulas según PDF
        const multiplier = this.calculateMultiplier(pointsData);
        const studyRate = this.calculateStudyRate(weeklyStudy, studiedDays || 1);
        
        const weeklyPoints = parseFloat((
          (multiplier * studyRate) + 
          weeklyAdded + 
          this.calculateStreakBonus(lastPoint.study_streak || 0) +
          this.calculateAddedStreakBonus(lastPoint.added_streak || 0) +
          this.calculateActiveStreakBonus(lastPoint.active_streak || 0) +
          this.calculateActiveDaysStreakBonus(lastPoint.active_days_streak || 0)
        ).toFixed(2));

        tableData.push({
          student: username,
          points: weeklyPoints,
          totalPoints: parseFloat((totalStudy + totalAdded).toFixed(2)),
          added: weeklyAdded,
          studyRate: studyRate,
          daysStudied: studiedDays,
          streak: lastPoint.study_streak || 0,
          studied: weeklyStudy,
          maxLevel: this.calculateMaxLevel(pointsData),
          activeDays: lastPoint.active_days_streak || 0,
          addedStreak: lastPoint.added_streak || 0,
          activeStreak: lastPoint.active_streak || 0,
          activeDaysStreak: lastPoint.active_days_streak || 0
        });
      } catch (error) {
        console.error(`Error procesando usuario ${username}:`, error);
      }
    });

    return tableData;
  }

  private normalizeUsername(username: string): string {
    if (!username) return 'unknown';
    // Elimina espacios, convierte a minúsculas y elimina caracteres especiales
    return username.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  private combineData(pointsData: any[], reportsData: any[]): { [username: string]: CombinedUserData } {
    const combined: { [username: string]: CombinedUserData } = {};
  
    // Procesar pointsData
    pointsData.forEach(point => {
      const rawUsername = point.attributes?.legacy_username;
      const username = this.normalizeUsername(rawUsername);
      if (!combined[username]) {
        combined[username] = { pointsData: [], reportsData: [] };
      }
      combined[username].pointsData.push(this.processPoint(point));
    });
  
    // Procesar reportsData
    reportsData.forEach(report => {
      const rawUsername = report.attributes?.legacy_username;
      const username = this.normalizeUsername(rawUsername);
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
      day_reported: point.attributes?.day_reported || '' // <--- AQUI ES CLAVE
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
