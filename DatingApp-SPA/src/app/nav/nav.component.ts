import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public model: any = {};

  constructor(public authService: AuthService, private alertifyService: AlertifyService) { }

  ngOnInit() {
  }

  public login(): void {
    this.authService.login(this.model).subscribe(next => {
      this.alertifyService.success('Logged in successfully');
    }, error => {
      this.alertifyService.error(error);
    });
  }

  public loggedIn(): boolean {
    return this.authService.loggedIn();
  }

  public logout(): void {
    localStorage.removeItem('token');
    this.alertifyService.message('Logged out');
  }
}
