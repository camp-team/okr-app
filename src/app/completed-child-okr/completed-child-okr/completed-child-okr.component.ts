import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { SecondOkr } from 'src/app/interfaces/second-okr';
import { SecondOkrKeyResult } from 'src/app/interfaces/second-okr-key-result';
import { SecondOkrObject } from 'src/app/interfaces/second-okr-object';
import { AuthService } from 'src/app/services/auth.service';
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
    [keyName: string]: FormArray;
  } = {};
  secondOkrObjectTitles: {
    [keyName: string]: FormArray;
  } = {};
  secondOkrObjectTitle: FormGroup;
  secondOkrObjects: SecondOkrObject[] = [];
  secondOkr$: Observable<SecondOkr[]> = this.okrService.getSecondOkrs();
  secondOkrObjects$: Observable<
    SecondOkrObject[]
  > = this.okrService.getSecondOkrObjects(this.secondOkrId);
  secondOkrKeyResults$: Observable<
    SecondOkrKeyResult[]
  > = this.okrService.getSecondOkrKeyResultsCollection(this.secondOkrId);
  isComplete: boolean;
  isCompletes = [];
  isSecondOkr: boolean;
  secondOkr: SecondOkr;

  constructor(
    private route: ActivatedRoute,
    public okrService: OkrService,
    private fb: FormBuilder,
    private datepipe: DatePipe,
    private authService: AuthService
  ) {}

  ngOnInit() {
    combineLatest([this.secondOkrObjects$, this.secondOkrKeyResults$])
      .pipe(take(1))
      .subscribe(([secondOkrObjects, secondOkrKeyResult]) => {
        secondOkrObjects.forEach((secondOkrObject) => {
          this.secondOkrObjects.push(secondOkrObject);
          this.rows[secondOkrObject.secondOkrObjectId] = this.fb.array([]);
          this.secondOkrObjectTitles[
            secondOkrObject.secondOkrObjectId
          ] = this.fb.array([]);
          this.initSecondOkrObject(
            secondOkrObject.secondOkrObjectId,
            secondOkrObject.secondOkrObject
          );
        });
        secondOkrKeyResult.forEach((secondOkrKeyResult) => {
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
    this.secondOkr$.subscribe((secondOkrs) => {
      if (secondOkrs.length === 0) {
        this.isSecondOkr = false;
      } else {
        this.isSecondOkr = true;
      }
      secondOkrs.map((secondOkr) => {
        this.isComplete = secondOkr.isComplete;
        this.isCompletes.push(this.isComplete);
        this.isCompletes.forEach((isComplete) => {
          if (isComplete === true) {
            this.isComplete = true;
          }
        });
        if (secondOkr.isComplete === true) this.secondOkr = secondOkr;
      });
    });
  }

  initSecondOkrObject(secondOkrObjectId: string, secondOkrObject: string) {
    this.secondOkrObjectTitle = this.fb.group({
      primaryTitle: [secondOkrObject, [Validators.required]],
    });
    this.secondOkrObjectTitles[secondOkrObjectId].push(
      this.secondOkrObjectTitle
    );
  }

  initRows(
    key: String,
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
      key: [key, [Validators.required]],
      target: [target, [Validators.required]],
      current: [current, [Validators.required]],
      percentage: [percentage, [Validators.required]],
      lastUpdated: [date, [Validators.required]],
      secondOkrKeyResultId,
    });
    this.rows[secondOkrObjectId].push(this.row);
  }

  okrId() {
    this.secondOkr$.subscribe((secondOkr) => {
      secondOkr.forEach((secondOkr) => {
        secondOkr.secondOkrId;
      });
    });
  }

  addRow(secondOkrObjectId: string) {
    this.row = this.fb.group({
      key: ['', [Validators.required]],
      target: ['', [Validators.required]],
      current: ['', [Validators.required]],
      percentage: ['', [Validators.required]],
      lastUpdated: ['', [Validators.required]],
    });
    this.rows[secondOkrObjectId].push(this.row);
    const formData = this.row.value;
    const subTaskValue: Omit<
      SecondOkrKeyResult,
      'secondOkrKeyResultId' | 'lastUpdated'
    > = {
      secondOkrObjectId,
      secondOkrId: this.secondOkrId,
      key: formData.key,
      target: formData.target,
      current: formData.current,
      percentage: formData.percentage,
      uid: this.authService.uid,
    };
    this.okrService.createSecondOkrKeyResult(
      subTaskValue,
      secondOkrObjectId,
      this.secondOkrId
    );
  }

  removeRow(secondOkrObjectId: string, rowIndex: number) {
    this.rows[secondOkrObjectId].removeAt(rowIndex);
  }

  updateSecondOkrKeyResult(
    secondOkrObjectId: string,
    secondOkrKeyResultId: string,
    row: SecondOkrKeyResult
  ) {
    this.secondOkrKeyResults$.subscribe((secondOkrKeyResults) => {
      let average = 0;
      const secondOkrKeyResultPercentage = secondOkrKeyResults.filter(
        (secondOkrKeyResult) => {
          if (secondOkrKeyResult.secondOkrObjectId === secondOkrObjectId) {
            return secondOkrKeyResult.percentage;
          }
        }
      );
      for (let i = 0; i < secondOkrKeyResultPercentage.length; i++) {
        const subTaskPercentageNumber = secondOkrKeyResultPercentage[
          i
        ].percentage.slice(0, -1);
        average = average + +subTaskPercentageNumber;
      }
      const secondOkrObject: Omit<SecondOkrObject, 'secondOkrObject'> = {
        secondOkrObjectId: secondOkrObjectId,
        average: average,
        uid: this.authService.uid,
      };

      this.okrService.updateSecondOkrObject(
        this.authService.uid,
        this.secondOkrId,
        secondOkrObjectId,
        secondOkrObject
      );
    });

    const target = row.target;
    const current = row.current;
    const percentage = (current / target) * 100;
    const result = Math.round(percentage * 10) / 10;
    const formData = row;
    const secondOkrKeyResult: Omit<SecondOkrKeyResult, 'lastUpdated'> = {
      secondOkrId: this.secondOkrId,
      secondOkrObjectId,
      secondOkrKeyResultId: secondOkrKeyResultId,
      uid: this.authService.uid,
      key: formData.key,
      target: formData.target,
      current: formData.current,
      percentage: result + '%',
    };
    this.okrService.updateSecondOkrKeyResult(
      this.authService.uid,
      this.secondOkrId,
      secondOkrObjectId,
      secondOkrKeyResultId,
      secondOkrKeyResult
    );
  }
}
