import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
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
