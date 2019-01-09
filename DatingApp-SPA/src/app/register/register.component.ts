import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() valuesFromHome: any;
  @Output() cancelRegistration = new EventEmitter();
  public model: any = {};

  constructor() { }

  ngOnInit() {
  }

  public register(): void {
    console.log(this.model);
  }

  public cancel(): void {
    this.cancelRegistration.emit(true);
    console.log('Cancelled');
  }

}
