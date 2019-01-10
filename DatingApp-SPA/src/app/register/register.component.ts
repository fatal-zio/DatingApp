import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegistration = new EventEmitter();
  public model: any = {};

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  public register(): void {
    this.authService.register(this.model).subscribe(() => {
      console.log('Registration successful');
    }, error => {
      console.log(error);
    });
  }

  public cancel(): void {
    this.cancelRegistration.emit(true);
    console.log('Cancelled');
  }

}
