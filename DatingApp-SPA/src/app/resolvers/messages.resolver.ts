import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { AlertifyService } from '../services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../models/message';
import { AuthService } from '../services/auth.service';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {
  public pageNumber = 1;
  public pageSize = 5;
  public messageContainer = 'Unread';

  constructor(
    private userService: UserService,
    private router: Router,
    private alertifyService: AlertifyService,
    private authService: AuthService
  ) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
    return this.userService
      .getMessages(
        this.authService.getNameId(),
        this.pageNumber,
        this.pageSize,
        this.messageContainer
      )
      .pipe(
        catchError(error => {
          this.alertifyService.error('Problem retrieving messages.');
          this.router.navigate(['/home']);
          return of(null);
        })
      );
  }
}
