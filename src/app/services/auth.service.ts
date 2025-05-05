import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private authUrl = `${environment.strapiUrl}/auth/local`;

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.authUrl, {
      identifier: username,
      password,
    });
  }
}
