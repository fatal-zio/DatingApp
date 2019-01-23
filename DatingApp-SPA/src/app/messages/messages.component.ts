import { Component, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { Pagination, PaginatedResult } from '../models/pagination';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../services/alertify.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  public messages: Message[];
  public pagination: Pagination;
  public messageContainer = 'Unread';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });
  }

  public loadMessages() {
    this.userService
      .getMessages(
        this.authService.getNameId(),
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.messageContainer
      )
      .subscribe(
        (result: PaginatedResult<Message[]>) => {
          this.messages = result.result;
          this.pagination = result.pagination;
        },
        error => {
          this.alertifyService.error(error);
        }
      );
  }

  public pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

  public deleteMessage(id: number) {
    this.alertifyService.confirm(
      'Are you sure you want to delete this message?',
      () => {
        this.userService
          .deleteMessage(id, this.authService.getNameId())
          .subscribe(
            () => {
              this.messages.splice(
                this.messages.findIndex(o => o.id === id),
                1
              );
              this.alertifyService.success('Message deleted.');
            },
            error => {
              this.alertifyService.error(error);
            }
          );
      }
    );
  }
}
