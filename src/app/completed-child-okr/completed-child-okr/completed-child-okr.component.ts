import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { SecondOkrKeyResult } from 'src/app/interfaces/second-okr-key-result';
import { SecondOkrObject } from 'src/app/interfaces/second-okr-object';
import { OkrService } from 'src/app/services/okr.service';

@Component({
  selector: 'app-completed-child-okr',
  templateUrl: './completed-child-okr.component.html',
  styleUrls: ['./completed-child-okr.component.scss'],
  providers: [DatePipe],
})
export class CompletedChildOkrComponent implements OnInit {
  private secondOkrId = this.route.snapshot.queryParamMap.get('v');
  row: FormGroup;
  rows: {
    [secondOkrObjectId: string]: FormArray;
  } = {};
  secondOkrObjectTitles: {
    [secondOkrObjectId: string]: FormArray;
  } = {};
  secondOkrObjectTitle: FormGroup;
  secondOkrObjects: SecondOkrObject[] = [];
  secondOkrObjects$: Observable<
    SecondOkrObject[]
  > = this.okrService.getSecondOkrObjects(this.secondOkrId);
  secondOkrKeyResults$: Observable<
    SecondOkrKeyResult[]
  > = this.okrService.getSecondOkrKeyResultsCollection(this.secondOkrId);

  constructor(
    private route: ActivatedRoute,
    public okrService: OkrService,
    private fb: FormBuilder,
    private datepipe: DatePipe
  ) {}

  ngOnInit() {
    combineLatest([this.secondOkrObjects$, this.secondOkrKeyResults$])
      .pipe(take(1))
      .subscribe(([secondOkrObjects, secondOkrKeyResults]) => {
        secondOkrObjects.forEach((secondOkrObject) => {
          this.secondOkrObjects.push(secondOkrObject);
          this.rows[secondOkrObject.secondOkrObjectId] = this.fb.array([]);
          this.secondOkrObjectTitles[
            secondOkrObject.secondOkrObjectId
          ] = this.fb.array([]);
          this.initSecondOkrObject(secondOkrObject);
        });
        secondOkrKeyResults.forEach((secondOkrKeyResult) => {
          this.initRows(
            secondOkrKeyResult.key,
            secondOkrKeyResult.target,
            secondOkrKeyResult.current,
            secondOkrKeyResult.percentage,
            secondOkrKeyResult.lastUpdated,
            secondOkrKeyResult.secondOkrObjectId,
            secondOkrKeyResult.secondOkrKeyResultId
          );
        });
      });
  }

  initSecondOkrObject(secondOkrObject) {
    this.secondOkrObjectTitle = this.fb.group({
      primaryTitle: [
        secondOkrObject.secondOkrObject,
        [Validators.required, Validators.maxLength(20)],
      ],
    });
    this.secondOkrObjectTitles[secondOkrObject.secondOkrObjectId].push(
      this.secondOkrObjectTitle
    );
  }

  initRows(
    key: string,
    target: number,
    current: number,
    percentage: string,
    lastUpdated: firebase.default.firestore.Timestamp,
    secondOkrObjectId: string,
    secondOkrKeyResultId: string
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
      secondOkrKeyResultId,
    });
    this.rows[secondOkrObjectId].push(this.row);
  }
}
