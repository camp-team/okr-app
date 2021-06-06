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
  user$ = this.authService.user$;
  isChildOkr: boolean;
  avatarURL: string;
  childOkrs$: Observable<ChildOkr[]> = this.okrService
    .getChildOkrs()
    .pipe(tap(() => (this.loadingService.loading = false)));
  childOkr: ChildOkr;
  isChildOkrComplete: boolean;
  isChildOkrCompletes = [];
  content: number;
  transitionTargetArray: string[];
  i: number;
  parentOkrTarget: string;
  transitionTargetIndex = [0, 1, 2, 3, 4, 5];
  tab: string;

  constructor(
    public authService: AuthService,
    public okrService: OkrService,
    public loadingService: LoadingService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.transitionTargetArray = [
      'ホーム',
      '進行中のOKR',
      '完了したOKR',
      'プロジェクト',
      '新規OKR',
      '新規タスク',
    ];
    this.router.events.subscribe(() => {
      switch (this.router.url) {
        case '/manage/home':
          this.i = this.transitionTargetIndex[0];
          this.tab = 'home-panel';
          break;
        case '/manage/child-okr?id=' +
          this.route.snapshot.queryParamMap.get('id'):
          this.i = this.transitionTargetIndex[1];
          this.tab = 'child-okr-panel';
          break;
        case '/manage/child-okr':
          this.i = this.transitionTargetIndex[1];
          break;
        case '/manage/achieve':
          this.i = this.transitionTargetIndex[2];
          this.tab = 'achieve-panel';
          break;
        case '/manage/okr-project?id=' +
          this.route.snapshot.queryParamMap.get('id'):
          this.i = this.transitionTargetIndex[3];
          break;
        case '/manage/edit':
          this.i = this.transitionTargetIndex[4];
          break;
        case '/manage/okr-edit':
          this.i = this.transitionTargetIndex[5];
          break;
      }
    });

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

  setTabState(event: MouseEvent): void {
    const element = event.currentTarget as HTMLElement;
    const tabState = element.getAttribute('aria-controls');
    this.tab = tabState;
  }

  setTransitionTargetIndex(index: number) {
    this.i = this.transitionTargetIndex[index];
  }

  progress() {
    this.i = 1;
    this.router.navigate(['manage/child-okr'], {
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
