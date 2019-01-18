import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegistration = new EventEmitter();
  public user: User;
  public registerForm: FormGroup;
  public bsConfig: Partial<BsDatepickerConfig>;

  constructor(
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.bsConfig = {
      containerClass: 'theme-dark-blue'
    };
    this.createRegisterForm();
  }

  private createRegisterForm() {
    this.registerForm = this.fb.group(
      {
        gender: ['male'],
        username: ['', Validators.required],
        knownAs: ['', Validators.required],
        dateOfBirth: [null, Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(8)
          ]
        ],
        confirmPassword: ['', Validators.required]
      },
      { validator: this.passwordMatchValidator }
    );
  }

  public passwordMatchValidator(group: FormGroup) {
    return group.get('password').value === group.get('confirmPassword').value
      ? null
      : { mismatch: true };
  }

  public register(): void {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authService.register(this.user).subscribe(
        () => {
          this.alertifyService.success('Registration successful');
        },
        error => {
          this.alertifyService.error(error);
        },
        () => {
          this.authService.login(this.user).subscribe(() => {
            this.router.navigate(['/members']);
          });
        }
      );
    }
  }

  public cancel(): void {
    this.cancelRegistration.emit(true);
  }
}
