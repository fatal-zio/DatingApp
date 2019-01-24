import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { AdminService } from '../../services/admin.service';
import { AlertifyService } from '../../services/alertify.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { RolesModalComponent } from '../roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  public users: User[];
  public bsModalRef: BsModalRef;

  constructor(
    private adminService: AdminService,
    private alertifyService: AlertifyService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.getUsersWithRoles();
  }

  public getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe(
      (users: User[]) => {
        this.users = users;
      },
      error => {
        this.alertifyService.error(error);
      }
    );
  }

  public editRolesModal() {
    const initialState = {
      list: [
        'Open a modal with component',
        'Pass your data',
        'Do something else',
        '...'
      ],
      title: 'Modal with component'
    };
    this.bsModalRef = this.modalService.show(RolesModalComponent, {
      initialState
    });
    this.bsModalRef.content.closeBtnName = 'Close';
  }
}
