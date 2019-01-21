import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { AlertifyService } from '../../services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from '../..//models/pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  public users: User[];
  public user: User = JSON.parse(localStorage.getItem('user'));
  public genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];
  public userParams: any = {};
  public pagination: Pagination;

  constructor(
    private userService: UserService,
    private alertifyService: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });

    this.setDefaultFilterAndSort();
  }

  public resetFilterAndSort(): void {
    this.setDefaultFilterAndSort();
    this.loadUsers();
  }

  private setDefaultFilterAndSort(): void {
    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
  }

  public pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  public loadUsers() {
    this.userService
      .getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe(
        (results: PaginatedResult<User[]>) => {
          this.users = results.result;
          this.pagination = results.pagination;
        },
        error => {
          this.alertifyService.error(error);
        }
      );
  }
}
