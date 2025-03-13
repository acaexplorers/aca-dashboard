import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "environments/environment";
import { map, switchMap, take, tap} from "rxjs/operators";
import { selectAuthToken } from "app/store/auth/selectors/auth.selectors";
import { Store, select } from "@ngrx/store";
import { ApiResponse } from "app/utils/types";

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
  getPointsData(startDate: string, endDate: string): Observable<any> {
    return this.getToken().pipe(
      tap((token) => console.log("Token obtenido por points en getToken():", token)),
      switchMap((token) => {
        const headers = new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        });

        const url = `${this.baseUrl}/scholar-reports?filters[day_reported][$gte]=${startDate}&filters[day_reported][$lte]=${endDate}`
        return this.http.get<ApiResponse<any>>(url, { headers });
      })
    );
  }

  /**
   * Send a report (upsert operation).
   * @param report Report data
   */
  sendReport(report: any): Observable<any> {
    return this.getToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        });

        const url = `${this.baseUrl}/scholar-reports/upsert`;
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
  
        const url = `${this.baseUrl}/scholar-reports?filters[day_reported][$gte]=${startDate}&filters[day_reported][$lte]=${endDate}&filters[legacy_username]=${username}`;
        return this.http.get<ApiResponse<any>>(url, { headers }).pipe(
          map((response) => response.data)
        );
      })
    );
  }

}

