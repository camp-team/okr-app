import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SecondOkrKeyResult } from '../interfaces/second-okr-key-result';
import { SecondOkrObject } from '../interfaces/second-okr-object';
import { OkrService } from '../services/okr.service';

@Component({
  selector: 'app-complete-okr',
  templateUrl: './complete-okr.component.html',
  styleUrls: ['./complete-okr.component.scss'],
})
export class CompleteOkrComponent implements OnInit {
  private secondOkrId = this.route.snapshot.queryParamMap.get('v');

  secondOkrObjects$: Observable<
    SecondOkrObject[]
  > = this.okrService.getSecondOkrObjects(this.secondOkrId);
  secondOkrKeyResults$: Observable<
    SecondOkrKeyResult[]
  > = this.okrService.getSecondOkrKeyResultsCollection(this.secondOkrId);
  constructor(private route: ActivatedRoute, public okrService: OkrService) {}

  ngOnInit() {}
}
