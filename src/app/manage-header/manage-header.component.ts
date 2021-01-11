import { Component, OnInit } from '@angular/core';
import { ManageService } from '../manage/manage/manage.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-manage-header',
  templateUrl: './manage-header.component.html',
  styleUrls: ['./manage-header.component.scss'],
})
export class ManageHeaderComponent implements OnInit {
  avatarURL: string;
  user$ = this.authService.user$;

  constructor(
    private manageService: ManageService,
    public authService: AuthService
  ) {
    this.authService.getUser(this.authService.uid).subscribe((result) => {
      this.avatarURL = result?.avatarURL;
    });
  }

  ngOnInit(): void {}

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  toggle() {
    this.manageService.toggle();
  }
}
