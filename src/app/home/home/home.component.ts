import { Component, OnInit } from '@angular/core';
import { Okr } from 'src/app/interfaces/okr';
import { OkrService } from 'src/app/services/okr.service';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from 'src/app/login-dialog/login-dialog.component';
import { TutorialService } from 'src/app/services/tutorial.service';
import { SecondOkr } from 'src/app/interfaces/second-okr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  okrs$: Observable<Okr[]> = this.okrService.getOkrs();
  secondOkrs$: Observable<SecondOkr[]> = this.okrService.getSecondOkrs();
  okr: boolean;
  secondOkrId: string;
  user: string;

  constructor(
    public okrService: OkrService,
    private authService: AuthService,
    private dialog: MatDialog,
    private tutorialService: TutorialService
  ) {
    this.isInitLogin();
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
    this.authService.user$.subscribe((user) => {
      this.user = user.name;
    });
    this.checkOkr();
    this.secondOkr();
  }

  checkOkr() {
    this.okrs$.subscribe((okrs) => {
      if (okrs.length === 0) {
        this.okr = false;
      } else {
        this.okr = true;
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

  ngAfterViewInit(num: number) {
    if (this.tutorialService.tutorial) {
      this.tutorialService.startOkrTutorial();
      this.tutorialService.tutorial = false;
    }
  }
}
