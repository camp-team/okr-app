import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SecondOkr } from '../interfaces/second-okr';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { OkrService } from '../services/okr.service';

@Component({
  selector: 'app-manage-footer',
  templateUrl: './manage-footer.component.html',
  styleUrls: ['./manage-footer.component.scss'],
})
export class ManageFooterComponent implements OnInit {
  isSecondOkr: boolean;
  isComplete: boolean;
  secondOkr: SecondOkr;
  secondOkrs$: Observable<SecondOkr[]> = this.okrService
    .getSecondOkrs()
    .pipe(tap(() => (this.loadingService.loading = false)));

  constructor(
    public authService: AuthService,
    public okrService: OkrService,
    public loadingService: LoadingService,
    private router: Router
  ) {
    this.loadingService.loading = true;
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
        if (secondOkr.isComplete === true) this.secondOkr = secondOkr;
      });
    });
  }

  progress() {
    this.router.navigate(['manage/secondOkr'], {
      queryParams: { v: this.secondOkr.secondOkrId },
    });
  }
}
