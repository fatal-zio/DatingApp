import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiUrl + 'users/';

  constructor(private http: HttpClient) {}

  public getUsers(): Observable<User[]> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.get<User[]>(this.baseUrl, {headers});
  }

  public getUser(id: number): Observable<User> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.get<User>(this.baseUrl + id, {headers});
  }

  public updateUser(id: number, user: User) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.put<User>(this.baseUrl + id, user, {headers});
  }

  public setMainPhoto(userId: number, photoId: number) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.post(this.baseUrl + userId + '/photos/' + photoId + '/setmain', {}, {headers});
  }
}
