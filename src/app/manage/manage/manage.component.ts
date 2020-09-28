import { Component, OnInit } from '@angular/core';
import { ManageService } from './manage.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
})
export class ManageComponent implements OnInit {
  opened: boolean;
  user$ = this.authService.user$;
  avatarURL: string;

  constructor(
    private manageService: ManageService,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.manageService.toggle(),
      this.manageService.isOpen$.subscribe((opened) => (this.opened = opened));
    this.userService.getUser(this.authService.uid).subscribe((result) => {
      this.avatarURL = result?.avatarURL;
    });
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  ngOnInit(): void {}
}
