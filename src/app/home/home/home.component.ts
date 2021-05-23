import { Component, OnInit } from '@angular/core';
import { OkrService } from 'src/app/services/okr.service';
import { AuthService } from 'src/app/services/auth.service';
import { combineLatest, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from 'src/app/login-dialog/login-dialog.component';
import { ChildOkr } from 'src/app/interfaces/child-okr';
import { DeleteChildOkrDialogComponent } from 'src/app/delete-child-okr-dialog/delete-child-okr-dialog.component';
import { LoadingService } from 'src/app/services/loading.service';
import { DeleteParentOkrDialogComponent } from 'src/app/delete-parent-okr-dialog/delete-parent-okr-dialog.component';
import { TutorialService } from 'src/app/services/tutorial.service';
import { ParentOkr } from 'src/app/interfaces/parent-okr';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user: string;
  parentOkrs: ParentOkr[];
  childOkrs: ChildOkr[];
  parentOkr: boolean;
  childOkrId: string;
  progressChildOkrs$: Observable<
    ChildOkr[]
  > = this.okrService.getChildOkrInProgress();
  achieveChildOkrs$: Observable<
    ChildOkr[]
  > = this.okrService.getAchieveChildOkrs();
  progressChildOkrs: ChildOkr[];

  constructor(
    public okrService: OkrService,
    public authService: AuthService,
    private dialog: MatDialog,
    private loadingService: LoadingService,
    private tutorialService: TutorialService,
    private router: Router
  ) {
    this.loadingService.loading = true;
    combineLatest([
      this.okrService.parentOkrs$,
      this.okrService.childOkrs$,
      this.authService.user$,
      this.progressChildOkrs$,
    ]).subscribe(([parentOkrs, childOkrs, user, progressChildOkr]) => {
      this.parentOkrs = parentOkrs;
      this.childOkrs = childOkrs;
      this.user = user.name;
      this.progressChildOkrs = progressChildOkr;

      this.checkParentOkr();
      this.checkChildtOkr();
    });
    this.isFirstLogin();
    this.loadingService.loading = false;
  }

  private isFirstLogin() {
    if (this.authService.initialLogin) {
      this.dialog.open(LoginDialogComponent, {
        autoFocus: false,
        restoreFocus: false,
      });
      this.authService.initialLogin = false;
    }
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
    this.determineIfStartingTutorial();
  }

  checkParentOkr() {
    const parentOkrIsEmpty = this.parentOkrs.length;
    if (parentOkrIsEmpty === 0) {
      this.parentOkr = false;
    } else {
      this.parentOkr = true;
    }
  }

  checkChildtOkr() {
    this.childOkrs.forEach((childOkr) => {
      if (childOkr.isChildOkrComplete) {
        this.childOkrId = childOkr.childOkrId;
      } else {
        return null;
      }
    });
  }

  determineIfStartingTutorial() {
    if (this.tutorialService.tutorial) {
      this.tutorialService.startTutorial({
        okrType: 'childOkr',
        groupIndex: 0,
      });
      this.tutorialService.tutorial = false;
    }
  }

  deleteFindByChildOkr(childOkrId: string) {
    this.dialog.open(DeleteChildOkrDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      data: {
        childOkrId: childOkrId,
      },
    });
  }

  deleteParentOkr(parentOkrId: string) {
    this.dialog.open(DeleteParentOkrDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      data: {
        parentOkrId: parentOkrId,
      },
    });
  }
}
