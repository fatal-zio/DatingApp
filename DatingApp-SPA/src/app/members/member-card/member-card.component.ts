import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit() {}

  public sendLike(id: number) {
    this.userService.sendLike(this.authService.getNameId(), id).subscribe(
      data => {
        this.alertifyService.success('You have liked: ' + this.user.knownAs);
      },
      error => {
        this.alertifyService.error(error);
      }
    );
  }
}
