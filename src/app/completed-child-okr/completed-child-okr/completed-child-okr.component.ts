import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ChildOkrKeyResult } from 'src/app/interfaces/child-okr-key-result';
import { ChildOkrObjective } from 'src/app/interfaces/child-okr-objective';
import { OkrService } from 'src/app/services/okr.service';

@Component({
  selector: 'app-completed-child-okr',
  templateUrl: './completed-child-okr.component.html',
  styleUrls: ['./completed-child-okr.component.scss'],
  providers: [DatePipe],
})
export class CompletedChildOkrComponent implements OnInit {
  private childOkrId = this.route.snapshot.queryParamMap.get('id');
  row: FormGroup;
  rows: {
    [childOkrObjectiveId: string]: FormArray;
  } = {};
  childOkrObjectiveTitles: {
    [childOkrObjectiveId: string]: FormArray;
  } = {};
  childOkrObjectiveTitle: FormGroup;
  childOkrObjectives: ChildOkrObjective[] = [];
  childOkrObjectives$: Observable<
    ChildOkrObjective[]
  > = this.okrService.getChildOkrObjects(this.childOkrId);
  childOkrKeyResults$: Observable<
    ChildOkrKeyResult[]
  > = this.okrService.getChildOkrKeyResultsCollection(this.childOkrId);

  constructor(
    private route: ActivatedRoute,
    public okrService: OkrService,
    private fb: FormBuilder,
    private datepipe: DatePipe
  ) {}

  ngOnInit() {
    combineLatest([this.childOkrObjectives$, this.childOkrKeyResults$])
      .pipe(take(1))
      .subscribe(([childOkrObjectives, childOkrKeyResults]) => {
        childOkrObjectives.forEach((childOkrObjective) => {
          this.childOkrObjectives.push(childOkrObjective);
          this.rows[childOkrObjective.childOkrObjectiveId] = this.fb.array([]);
          this.childOkrObjectiveTitles[
            childOkrObjective.childOkrObjectiveId
          ] = this.fb.array([]);
          this.initChildOkrObjective(childOkrObjective);
        });
        childOkrKeyResults.forEach((childOkrKeyResult) => {
          this.initRows(
            childOkrKeyResult.key,
            childOkrKeyResult.target,
            childOkrKeyResult.current,
            childOkrKeyResult.percentage,
            childOkrKeyResult.lastUpdated,
            childOkrKeyResult.childOkrObjectiveId,
            childOkrKeyResult.childOkrKeyResultId
          );
        });
      });
  }

  initChildOkrObjective(childOkrObjective) {
    this.childOkrObjectiveTitle = this.fb.group({
      primaryTitle: [
        childOkrObjective.childOkrObjective,
        [Validators.required, Validators.maxLength(20)],
      ],
    });
    this.childOkrObjectiveTitles[childOkrObjective.childOkrObjectiveId].push(
      this.childOkrObjectiveTitle
    );
  }

  initRows(
    key: string,
    target: number,
    current: number,
    percentage: string,
    lastUpdated: firebase.default.firestore.Timestamp,
    childOkrObjectiveId: string,
    childOkrKeyResultId: string
  ) {
    const timeStamp = lastUpdated.toDate();
    const date = this.datepipe.transform(timeStamp, 'yyyy/MM/dd');
    this.row = this.fb.group({
      key: [key, [Validators.required, Validators.maxLength(20)]],
      target: [
        target,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(3),
        ],
      ],
      current: [
        current,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(3),
        ],
      ],
      percentage: [percentage, [Validators.required]],
      lastUpdated: [date, [Validators.required]],
      childOkrKeyResultId,
    });
    this.rows[childOkrObjectiveId].push(this.row);
  }
}
