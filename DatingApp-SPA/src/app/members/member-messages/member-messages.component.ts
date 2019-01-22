import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../../models/message';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  public messages: Message[];
  public newMessage: any = {};

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit() {
    this.loadMessages();
    console.log(this.messages);
  }

  public loadMessages() {
    this.userService
      .getMessageThread(this.authService.getNameId(), this.recipientId)
      .subscribe(
        messages => {
          this.messages = messages;
        },
        error => {
          this.alertifyService.error(error);
        }
      );
  }

  public sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService
      .sendMessage(this.authService.getNameId(), this.newMessage)
      .subscribe(
        (message: Message) => {
          this.messages.unshift(message);
          this.newMessage.content = '';
        },
        error => {
          this.alertifyService.error(error);
        }
      );
  }
}
