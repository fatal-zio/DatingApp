import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './guards/auth.guard';
import { MemberListComponent } from './members/member-list/member-list.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent},
  { path: '', runGuardsAndResolvers: 'always', canActivate: [AuthGuard], children: [
    { path: 'members', component: MemberListComponent},
    { path: 'messages', component: MessagesComponent},
    { path: 'lists', component: ListsComponent},
  ]},
  { path: '**', redirectTo: '', pathMatch: 'full'}
];
