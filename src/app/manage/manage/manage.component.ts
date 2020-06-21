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

  constructor(
    private manageService: ManageService,
    private authService: AuthService
  ) {
    this.manageService.toggle(),
      this.manageService.isOpen$.subscribe((opened) => (this.opened = opened));
  }

  login() {
    this.authService.login();
  }

  ngOnInit(): void {}
}
