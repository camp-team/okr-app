import { Component, OnInit } from '@angular/core';
import { OkrService } from 'src/app/services/okr.service';
import { AuthService } from 'src/app/services/auth.service';
import { combineLatest, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from 'src/app/login-dialog/login-dialog.component';
import { SecondOkr } from 'src/app/interfaces/second-okr';
import { DeleteSecondOkrDialogComponent } from 'src/app/delete-second-okr-dialog/delete-second-okr-dialog.component';
import { LoadingService } from 'src/app/services/loading.service';
import { OkrDeleteDialogComponent } from 'src/app/okr-delete-dialog/okr-delete-dialog.component';
import { TutorialService } from 'src/app/services/tutorial.service';
import { Okr } from 'src/app/interfaces/okr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user: string;
  parentOkrs: Okr[];
  childOkrs: SecondOkr[];
  parentOkr: boolean;
  secondOkrId: string;
  achieveSecondOkrs$: Observable<
    SecondOkr[]
  > = this.okrService.searchAchieveSecondOkrs();

  constructor(
    public okrService: OkrService,
    public authService: AuthService,
    private dialog: MatDialog,
    private loadingService: LoadingService,
    private tutorialService: TutorialService
  ) {
    this.loadingService.loading = true;
    combineLatest([
      this.okrService.parentOkrs$,
      this.okrService.childOkrs$,
      this.authService.user$,
    ]).subscribe(([parentOkrs, childOkrs, user]) => {
      this.parentOkrs = parentOkrs;
      this.childOkrs = childOkrs;
      this.user = user.name;
      this.checkParentOkr();
      this.checkChildtOkr();
    });
    this.isInitLogin();
    this.loadingService.loading = false;
  }

  private isInitLogin() {
    if (this.authService.initialLogin) {
      this.dialog.open(LoginDialogComponent, {
        autoFocus: false,
        restoreFocus: false,
      });
      this.authService.initialLogin = false;
    }
  }

  ngOnInit(): void {
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
    this.childOkrs.forEach((secondOkr) => {
      if (secondOkr.isComplete) {
        this.secondOkrId = secondOkr.secondOkrId;
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

  deleteFindByChildOkr(secondOkrId) {
    this.dialog.open(DeleteSecondOkrDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      data: {
        secondOkrId: secondOkrId,
      },
    });
  }

  deleteOkr(parentOkrId: string) {
    this.dialog.open(OkrDeleteDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      data: {
        okrId: parentOkrId,
      },
    });
  }
}
