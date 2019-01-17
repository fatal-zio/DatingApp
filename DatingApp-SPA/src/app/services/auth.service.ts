import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  private baseUrl = environment.apiUrl + 'auth/';
  private jwtHelper = new JwtHelperService();
  private currentUser: User;
  public currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient) { }

  public login(model: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.baseUrl + 'login', JSON.stringify(model), {headers})
      .pipe(
        map((response: any) => {
          const user = response;

          if (user) {
            localStorage.setItem('token', user.token);
            localStorage.setItem('user', JSON.stringify(user.user));
            this.currentUser = user.user;
            this.updateMemberPhoto(this.currentUser.photoUrl);
          }
        })
      );
  }

  public updateMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
    this.currentUser.photoUrl = photoUrl;
    localStorage.setItem('user', JSON.stringify(this.currentUser));
  }

  public register(model: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.baseUrl + 'register', model, {headers});
  }

  public loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  public getUsername(): string {
    const token = localStorage.getItem('token');

    if (token) {
      return this.jwtHelper.decodeToken(token).unique_name;
    } else {
      return '';
    }
  }

  public setUser(user: User): void {
    this.currentUser = user;
  }

  public getNameId(): number {
    const token = localStorage.getItem('token');

    if (token) {
      return +this.jwtHelper.decodeToken(token).nameid;
    } else {
      return null;
    }
  }

}
