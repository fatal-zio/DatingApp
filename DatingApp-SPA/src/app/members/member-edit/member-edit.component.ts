import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from '../../models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  public user: User;
  public photoUrl: string;
  @ViewChild('editForm') editForm: NgForm;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private alertifyService: AlertifyService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
    this.authService.currentPhotoUrl.subscribe(url => {
      this.photoUrl = url;
    });
  }

  public updateUser(): void {
    this.userService
      .updateUser(this.authService.getNameId(), this.user)
      .subscribe(
        () => {
          this.alertifyService.success('Profile updated.');
          this.editForm.reset(this.user);
        },
        error => {
          this.alertifyService.error(error);
        }
      );
  }

  public updateMainPhoto(photoUrl: string) {
    this.user.photoUrl = photoUrl;
  }
}
