import { Component, OnInit } from '@angular/core';
import { ManageService } from './manage.service';
import { AuthService } from 'src/app/services/auth.service';

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
    private authService: AuthService
  ) {
    this.manageService.toggle(),
      this.manageService.isOpen$.subscribe((opened) => (this.opened = opened));
    this.authService.getUser(this.authService.uid).subscribe((result) => {
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
