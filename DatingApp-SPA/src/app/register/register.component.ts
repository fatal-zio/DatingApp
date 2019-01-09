import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() valuesFromHome: any;
  public model: any = {};

  constructor() { }

  ngOnInit() {
  }

  public register(): void {
    console.log(this.model);
  }

  public cancel(): void {
    console.log('Cancelled');
  }

}
