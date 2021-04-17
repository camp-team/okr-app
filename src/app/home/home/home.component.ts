import { Component, OnInit } from '@angular/core';
import { Okr } from 'src/app/interfaces/okr';
import { OkrService } from 'src/app/services/okr.service';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from 'src/app/login-dialog/login-dialog.component';
import { ShepherdService } from 'angular-shepherd';
import { TutorialService } from 'src/app/services/tutorial.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  okrs$: Observable<Okr[]> = this.okrService.getOkrs();
  okr: boolean;

  constructor(
    public okrService: OkrService,
    private authService: AuthService,
    private dialog: MatDialog,
    private tutorialServide: TutorialService
  ) {
    this.isInitLogin();
  }

  private isInitLogin() {
    if (this.authService.isInitialLogin) {
      this.dialog.open(LoginDialogComponent, {
        autoFocus: false,
        restoreFocus: false,
      });
      this.authService.isInitialLogin = false;
    }
  }

  ngOnInit(): void {
    this.okrs$.subscribe((okrs) => {
      if (okrs.length === 0) {
        this.okr = false;
      } else {
        this.okr = true;
      }
    });
  }

  ngAfterViewInit(num: number) {
    this.tutorialServide.startOkrTutorial();
  }
}
