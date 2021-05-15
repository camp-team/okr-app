import { Component, OnInit } from '@angular/core';
import { OkrService } from 'src/app/services/okr.service';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from 'src/app/login-dialog/login-dialog.component';
import { SecondOkr } from 'src/app/interfaces/second-okr';
import { DeleteSecondOkrDialogComponent } from 'src/app/delete-second-okr-dialog/delete-second-okr-dialog.component';
import { LoadingService } from 'src/app/services/loading.service';
import { OkrDeleteDialogComponent } from 'src/app/okr-delete-dialog/okr-delete-dialog.component';
import { TutorialService } from 'src/app/services/tutorial.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  secondOkrs$: Observable<SecondOkr[]> = this.okrService.getSecondOkrs();
  achieveSecondOkrs$: Observable<
    SecondOkr[]
  > = this.okrService.searchAchieveSecondOkrs();
  parentOkr: boolean;
  secondOkrId: string;
  user: string;

  constructor(
    public okrService: OkrService,
    public authService: AuthService,
    private dialog: MatDialog,
    private loadingService: LoadingService,
    private tutorialService: TutorialService
  ) {
    this.loadingService.loading = true;
    this.authService.user$.subscribe((user) => {
      this.user = user.name;
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
    this.checkOkr();
    this.secondOkr();
    this.determineIfStartingTutorial();
  }

  checkOkr() {
    this.okrService.parentOkrs$.subscribe((parentOkrs) => {
      const parentOkrIsEmpty = parentOkrs.length;
      if (parentOkrIsEmpty === 0) {
        this.parentOkr = false;
      } else {
        this.parentOkr = true;
      }
    });
  }

  secondOkr() {
    this.secondOkrs$.subscribe((secondOkrs) => {
      secondOkrs.forEach((secondOkr) => {
        if (secondOkr.isComplete) {
          this.secondOkrId = secondOkr.secondOkrId;
        } else {
          return null;
        }
      });
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
