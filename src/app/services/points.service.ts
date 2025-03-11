import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PointsService {
  constructor(private http: HttpClient) {}

  getPointsData(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`/api/points?startDate=${startDate}&endDate=${endDate}`);
  }
}