import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { PaginatedResult } from '../models/pagination';
import { map } from 'rxjs/operators';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiUrl + 'users/';
  private headers;

  constructor(private http: HttpClient) {}

  public getUsers(
    page?,
    itemsPerPage?,
    userParams?,
    likesParam?
  ): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<
      User[]
    >();
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (userParams != null) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }

    if (likesParam === 'Likers') {
      params = params.append('likers', 'true');
    }

    if (likesParam === 'Likees') {
      params = params.append('likees', 'true');
    }

    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    return this.http
      .get<User[]>(this.baseUrl, {
        headers: headers,
        observe: 'response',
        params: params
      })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }
          return paginatedResult;
        })
      );
  }

  public getUser(id: number): Observable<User> {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    return this.http.get<User>(this.baseUrl + id, { headers });
  }

  public updateUser(id: number, user: User) {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    return this.http.put<User>(this.baseUrl + id, user, { headers });
  }

  public setMainPhoto(userId: number, photoId: number) {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    return this.http.post(
      this.baseUrl + userId + '/photos/' + photoId + '/setmain',
      {},
      { headers }
    );
  }

  public deletePhoto(userId: number, photoId: number) {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    return this.http.delete(this.baseUrl + userId + '/photos/' + photoId, {
      headers
    });
  }

  public sendLike(id: number, recipientId: number) {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    return this.http.post(
      this.baseUrl + id + '/like/' + recipientId,
      {},
      { headers }
    );
  }

  public getMessages(id: number, page?, itemsPerPage?, messageContainer?) {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<
      Message[]
    >();

    let params = new HttpParams();

    params = params.append('MessageContainer', messageContainer);

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http
      .get<Message[]>(this.baseUrl + id + '/messages', {
        observe: 'response',
        headers: headers,
        params: params
      })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') !== null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }

          return paginatedResult;
        })
      );
  }

  public getMessageThread(id: number, recipientId: number) {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );

    return this.http.get<Message[]>(
      this.baseUrl + id + '/messages/thread/' + recipientId,
      { headers }
    );
  }

  public sendMessage(id: number, message: Message) {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );

    return this.http.post(this.baseUrl + id + '/messages', message, { headers });
  }
}
