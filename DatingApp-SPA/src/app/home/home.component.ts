import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public registerMode = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  public registerToggle(): void {
    this.registerMode = true;
  }

  public cancelRegistrationMode(cancel: boolean): void {
    if (cancel) {
      this.registerMode = false;
    }
  }
}
