import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SecondOkr } from '../interfaces/second-okr';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { OkrService } from '../services/okr.service';

@Component({
  selector: 'app-manage-header',
  templateUrl: './manage-header.component.html',
  styleUrls: ['./manage-header.component.scss'],
})
export class ManageHeaderComponent implements OnInit {
  home = this.route.snapshot.params;
  secondOkrPath = this.route.snapshot.params;
  achieve = this.route.snapshot.params;
  user$ = this.authService.user$;
  isSecondOkr: boolean;
  avatarURL: string;
  secondOkrs$: Observable<SecondOkr[]> = this.okrService
    .getSecondOkrs()
    .pipe(tap(() => (this.loadingService.loading = false)));
  secondOkr: SecondOkr;
  isComplete: boolean;
  isCompletes = [];

  constructor(
    public authService: AuthService,
    public okrService: OkrService,
    public loadingService: LoadingService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loadingService.loading = true;
    this.authService.getUser(this.authService.uid).subscribe((result) => {
      this.avatarURL = result?.avatarURL;
    });
  }

  ngOnInit(): void {
    this.secondOkrs$.subscribe((secondOkrs) => {
      if (secondOkrs.length === 0) {
        this.isSecondOkr = false;
      } else {
        this.isSecondOkr = true;
      }
      secondOkrs.map((secondOkr) => {
        this.isComplete = secondOkr.isComplete;
        this.isCompletes.push(this.isComplete);
        this.isCompletes.forEach((isComplete) => {
          if (isComplete === true) {
            this.isComplete = true;
          }
        });
        if (secondOkr.isComplete === true) this.secondOkr = secondOkr;
      });
    });
  }

  progress() {
    this.router.navigate(['manage/secondOkr'], {
      queryParams: { id: this.secondOkr.secondOkrId },
    });
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
