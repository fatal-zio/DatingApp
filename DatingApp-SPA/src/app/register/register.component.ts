import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegistration = new EventEmitter();
  public model: any = {};
  public registerForm: FormGroup;

  constructor(
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
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
    /* this.authService.register(this.model).subscribe(() => {
      this.alertifyService.success('Registration successful');
    }, error => {
      this.alertifyService.error(error);
    }); */
    console.log(this.registerForm.value);
  }

  public cancel(): void {
    this.cancelRegistration.emit(true);
  }
}
