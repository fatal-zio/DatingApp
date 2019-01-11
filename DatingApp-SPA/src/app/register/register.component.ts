import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegistration = new EventEmitter();
  public model: any = {};

  constructor(private authService: AuthService, private alertifyService: AlertifyService) { }

  ngOnInit() {
  }

  public register(): void {
    this.authService.register(this.model).subscribe(() => {
      this.alertifyService.success('Registration successful');
    }, error => {
      this.alertifyService.error(error);
    });
  }

  public cancel(): void {
    this.cancelRegistration.emit(true);
  }

}
