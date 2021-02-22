import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SecondOkr } from '../interfaces/second-okr';
import { ManageService } from '../manage/manage/manage.service';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { OkrService } from '../services/okr.service';

@Component({
  selector: 'app-manage-header',
  templateUrl: './manage-header.component.html',
  styleUrls: ['./manage-header.component.scss'],
})
export class ManageHeaderComponent implements OnInit {
  avatarURL: string;
  user$ = this.authService.user$;
  secondOkrs$: Observable<SecondOkr[]> = this.okrService
    .getSecondOkrs()
    .pipe(tap(() => (this.loadingService.loading = false)));
  secondOkrs: SecondOkr[] = [];

  constructor(
    private manageService: ManageService,
    public authService: AuthService,
    public okrService: OkrService,
    public loadingService: LoadingService
  ) {
    this.loadingService.loading = true;
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
