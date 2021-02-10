import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { firestore } from 'firebase';
import { Observable } from 'rxjs';
import { Primary } from '../interfaces/primary';
import { SecondOkr } from '../interfaces/second-okr';
import { SecondOkrKeyResult } from '../interfaces/second-okr-key-result';
import { SecondOkrObject } from '../interfaces/second-okr-object';
import { AuthService } from '../services/auth.service';
import { OkrService } from '../services/okr.service';

@Component({
  selector: 'app-second-okr',
  templateUrl: './second-okr.component.html',
  styleUrls: ['./second-okr.component.scss'],
  providers: [DatePipe],
})
export class SecondOkrComponent implements OnInit {
  private row: FormGroup;
  public rows: {
    [keyName: string]: FormArray;
  } = {};
  public secondOkrObjectTitles: {
    [keyName: string]: FormArray;
  } = {};
  private secondOkrObjectTitle: FormGroup;
  private secondOkrId = this.route.snapshot.queryParamMap.get('v');
  secondOkrObjects: SecondOkrObject[] = [];

  secondOkr$: Observable<SecondOkr[]> = this.okrService.getSecondOkrs();
  secondOkrObjects$: Observable<
    SecondOkrObject[]
  > = this.okrService.getSecondOkrObjects(this.secondOkrId);
  secondOkrKeyResult$: Observable<
    SecondOkrKeyResult[]
  > = this.okrService.getSecondOkrKeyResults(this.secondOkrId);

  constructor(
    private route: ActivatedRoute,
    public okrService: OkrService,
    private fb: FormBuilder,
    private datepipe: DatePipe
  ) {}

  ngOnInit() {
    this.secondOkrObjects$.subscribe((secondOkrObjects) => {
      secondOkrObjects.forEach((secondOkrObject) => {
        this.secondOkrObjects.push(secondOkrObject);
        this.rows[secondOkrObject.id] = this.fb.array([]);
        this.secondOkrObjectTitles[secondOkrObject.id] = this.fb.array([]);
        this.initSecondOkrObject(
          secondOkrObject.id,
          secondOkrObject.secondOkrObject
        );
      });
    });
    this.secondOkrKeyResult$.subscribe((secondOkrKeyResult) => {
      secondOkrKeyResult.forEach((secondOkrKeyResult) => {
        this.initRows(
          secondOkrKeyResult.key,
          secondOkrKeyResult.target,
          secondOkrKeyResult.current,
          secondOkrKeyResult.percentage,
          secondOkrKeyResult.lastUpdated,
          secondOkrKeyResult.secondOkrId,
          secondOkrKeyResult.id
        );
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
    lastUpdated: firestore.Timestamp,
    secondOkrId: string,
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
    this.rows[secondOkrId].push(this.row);
  }

  okrId() {
    this.secondOkr$.subscribe((secondOkr) => {
      secondOkr.forEach((secondOkr) => {
        secondOkr.id;
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
    const subTaskValue: Omit<SecondOkrKeyResult, 'id' | 'lastUpdated'> = {
      secondOkrObjectId,
      secondOkrId: this.secondOkrId,
      key: formData.key,
      target: formData.target,
      current: formData.current,
      percentage: formData.percentage,
    };
    this.okrService.createSecondOkrKeyResult(
      subTaskValue,
      secondOkrObjectId,
      this.secondOkrId
    );
  }
}
