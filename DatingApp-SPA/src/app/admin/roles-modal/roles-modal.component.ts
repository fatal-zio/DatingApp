import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit {
  public title: string;
  public closeBtnName: string;
  public list: any[] = [];

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {}
}
