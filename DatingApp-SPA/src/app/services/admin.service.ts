import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = environment.apiUrl + 'admin/';

  constructor(private http: HttpClient) {}

  public getUsersWithRoles() {
    const headers = this.getAuthHeader();
    return this.http.get(this.baseUrl + 'userswithroles', { headers });
  }

  public updateUserRoles(user: User, roles: {}) {
    const headers = this.getAuthHeader();
    return this.http.post(this.baseUrl + 'editroles/' + user.userName, roles, {
      headers
    });
  }

  private getAuthHeader(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
  }
}
