import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from 'src/app/services/user.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  public user: User;

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
  }
}
