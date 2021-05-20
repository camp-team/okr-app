import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ChildOkr } from '../interfaces/child-okr';
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
  childOkrPath = this.route.snapshot.params;
  achieve = this.route.snapshot.params;
  user$ = this.authService.user$;
  isChildOkr: boolean;
  avatarURL: string;
  childOkrs$: Observable<ChildOkr[]> = this.okrService
    .getChildOkrs()
    .pipe(tap(() => (this.loadingService.loading = false)));
  childOkr: ChildOkr;
  isChildOkrComplete: boolean;
  isChildOkrCompletes = [];

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
    this.childOkrs$.subscribe((childOkrs) => {
      if (childOkrs.length === 0) {
        this.isChildOkr = false;
      } else {
        this.isChildOkr = true;
      }
      childOkrs.map((childOkr) => {
        this.isChildOkrComplete = childOkr.isChildOkrComplete;
        this.isChildOkrCompletes.push(this.isChildOkrComplete);
        this.isChildOkrCompletes.forEach((isChildOkrComplete) => {
          if (isChildOkrComplete === true) {
            this.isChildOkrComplete = true;
          }
        });
        if (childOkr.isChildOkrComplete === true) this.childOkr = childOkr;
      });
    });
  }

  progress() {
    this.router.navigate(['manage/childOkr'], {
      queryParams: { id: this.childOkr.childOkrId },
    });
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
