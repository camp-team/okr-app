import { Component, OnInit } from '@angular/core';
import { Okr } from 'src/app/interfaces/okr';
import { OkrService } from 'src/app/services/okr.service';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';

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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.okrs$.subscribe((okrs) => {
      console.log(okrs);
      if (okrs.length === 0) {
        this.okr = false;
      } else {
        this.okr = true;
      }
    });
  }
}
