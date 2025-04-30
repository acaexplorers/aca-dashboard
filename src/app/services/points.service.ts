import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";
import { map, switchMap, take, tap} from "rxjs/operators";
import { selectAuthToken } from "app/store/auth/selectors/auth.selectors";
import { Store, select } from "@ngrx/store";
import { ApiResponse } from "app/utils/types";

export interface QueryParams {
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}
@Injectable({
  providedIn: "root",
})
export class PointsService {
  private baseUrl: string = environment.strapiUrl;
  
  constructor(private http: HttpClient, private store: Store) {}

  /**
   * Get token from the store using the selector.
   */
  private getToken(): Observable<string> {
    return this.store.pipe(select(selectAuthToken), take(1));
  }
  
  /**
   * Get all global user points reports within a date range.
   * @param startDate Start date (YYYY-MM-DD)
   * @param endDate End date (YYYY-MM-DD)
   */
  //getPointsData(startDate: string, endDate: string): Observable<any> {
  getPointsData( params: QueryParams ): Observable<any> {
    const { startDate, endDate, page = 1, pageSize = 50 } = params;
    console.log("Fecha inicio (startDate):", startDate);
    console.log("Fecha fin (endDate):", endDate);
    return this.getToken().pipe(
      tap((token) => console.log("Token obtenido por points en getToken():", token)), 
      switchMap((token) => {
        const headers = new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        });      

        let queryString = `pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=legacy_username:ASC`;

        const filters: string[] = [];

        if (startDate) {
          filters.push(`filters[$and][0][week_start_date][$gte]=${startDate}`);
        }
  
        if (endDate) {
          //filters.push(`filters[$and][1][week_end_date][$lte]=${endDate}`);
        }
        
  
        if (filters.length > 0) {
          queryString += `&${filters.join("&")}`;
        }

        //const url = `${this.baseUrl}/student-streak-histories?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=legacy_username:ASC&filters[$and][0][week_start_date][$gte]=${startDate}&filters[$and][1][week_end_date][$lte]=${endDate}`;
        //const url = `${this.baseUrl}/student-streak-histories?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=legacy_username:ASC&filters[$and][0][week_start_date][$gte]=${startDate}`;
        const url = `${this.baseUrl}/student-streak-histories?${queryString}`;
        return this.http.get<ApiResponse<any>>(url, { headers });
      })
    );
  }

  /**
   * Send a report (upsert operation).
   * @param report Report data
   */
  sendReportPoints(report: any): Observable<any> {
    return this.getToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        });

        const url = `${this.baseUrl}/student-streak-histories`;
        return this.http.post(url, report, { headers });
      })
    );
  }

  /**
   * Get weekly user reports for a specific user within a date range.
   * @param startDate Start date (YYYY-MM-DD)
   * @param endDate End date (YYYY-MM-DD)
   * @param username Username to filter reports
   */
  getWeeklyPointsReports(
    startDate: string,
    endDate: string,
    username: string
  ): Observable<any[]> {
    console.log('params', startDate, endDate, username);
    return this.getToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        });
        
        const url = `${this.baseUrl}/student-streak-histories?filters[$and][0][week_start_date][$gt]=${startDate}&filters[$and][1][week_end_date][$lt]=${endDate}&sort=legacy_username:ASC`;
        return this.http.get<ApiResponse<any>>(url, { headers }).pipe(
          map((response) => response.data)
        );
      })
    );
  }

}

