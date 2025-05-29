import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import { switchMap, take } from "rxjs/operators";
import { selectAuthToken } from "app/store/auth/selectors/auth.selectors";
import { environment } from "../../environments/environment";
import { ApiResponse } from "app/utils/types";
import { StreakEntity } from "app/types/points.types";

@Injectable({
  providedIn: "root",
})
export class StreaksService {
  private baseUrl: string = environment.strapiUrl;

  constructor(private http: HttpClient, private store: Store) {}

  /**
   * Get token from the store using the selector.
   */
  private getToken(): Observable<string> {
    return this.store.pipe(select(selectAuthToken), take(1));
  }

  /**
   * Get streak data within a date range.
   * @param startDate Start date (YYYY-MM-DD)
   * @param endDate End date (YYYY-MM-DD)
   */
  getStreaksData(startDate: string, endDate: string): Observable<ApiResponse<StreakEntity[]>> {
    return this.getToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        });

        const url = `${this.baseUrl}/student-streak-histories?filters[week_start_date][$gte]=${startDate}&filters[week_end_date][$lte]=${endDate}`;
        return this.http.get<ApiResponse<StreakEntity[]>>(url, { headers });
      })
    );
  }

  /**
   * Get streaks for a specific user within a date range.
   * @param startDate Start date (YYYY-MM-DD)
   * @param endDate End date (YYYY-MM-DD)
   * @param username Username to filter streaks
   */
  getUserStreaks(
    startDate: string,
    endDate: string,
    username: string
  ): Observable<ApiResponse<StreakEntity[]>> {
    return this.getToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        });

        const url = `${this.baseUrl}/student-streak-histories?filters[week_start_date][$gte]=${startDate}&filters[week_end_date][$lte]=${endDate}&filters[legacy_username]=${username}`;
        return this.http.get<ApiResponse<StreakEntity[]>>(url, { headers });
      })
    );
  }
}