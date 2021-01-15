import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Okr } from 'src/app/interfaces/okr';
import { Primary } from 'src/app/interfaces/primary';
import { AuthService } from 'src/app/services/auth.service';
import { OkrService } from 'src/app/services/okr.service';

@Component({
  selector: 'app-okr',
  templateUrl: './okr.component.html',
  styleUrls: ['./okr.component.scss'],
})
export class OkrComponent implements OnInit {
  @Input() okr: Okr;
  primaries$: Observable<Primary[]>;

  constructor(
    private okrService: OkrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.primaries$ = this.okrService.getPrimaries(this.okr.id);
  }

  okrComplete(okrId: string) {
    const okrValue: Omit<
      Okr,
      | 'id'
      | 'primaries'
      | 'start'
      | 'end'
      | 'CreatorId'
      | 'title'
      | 'isComplete'
    > = {
      isComplete: false,
    };
    this.okrService.updateOkr(this.authService.uid, okrId, okrValue);
  }
}
