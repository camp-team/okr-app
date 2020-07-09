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
  okr$: Observable<Okr> = this.okrService.getOkr(this.authService.uid);

  constructor(
    private okrService: OkrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}
}
