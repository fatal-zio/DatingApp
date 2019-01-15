import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl + 'auth/';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  public login(model: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.baseUrl + 'login', JSON.stringify(model), {headers})
      .pipe(
        map((response: any) => {
          const user = response;

          if (user) {
            localStorage.setItem('token', user.token);
          }
        })
      );
  }

  public register(model: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.baseUrl + 'register', model, {headers});
  }

  public loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  public getUser(): string {
    const token = localStorage.getItem('token');

    if (token) {
      return this.jwtHelper.decodeToken(token).unique_name;
    } else {
      return '';
    }
  }

}
