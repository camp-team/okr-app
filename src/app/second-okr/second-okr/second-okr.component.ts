import { DatePipe, formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { SecondOkr } from 'src/app/interfaces/second-okr';
import { SecondOkrKeyResult } from 'src/app/interfaces/second-okr-key-result';
import { SecondOkrObject } from 'src/app/interfaces/second-okr-object';
import { AuthService } from 'src/app/services/auth.service';
import { OkrService } from 'src/app/services/okr.service';
import { TutorialService } from 'src/app/services/tutorial.service';

@Component({
  selector: 'app-second-okr',
  templateUrl: './second-okr.component.html',
  styleUrls: ['./second-okr.component.scss'],
  providers: [DatePipe],
})
export class SecondOkrComponent implements OnInit {
  private parentOkrId = this.route.snapshot.queryParamMap.get('id');
  row: FormGroup;
  rows: {
    [parentOkrObjectId: string]: FormArray;
  } = {};
  parentOkrObjectTitles: {
    [parentOkrObjectId: string]: FormArray;
  } = {};
  parentOkrObjectTitle: FormGroup;
  secondOkrObjects: SecondOkrObject[] = [];
  secondOkrObjects$: Observable<
    SecondOkrObject[]
  > = this.okrService.getSecondOkrObjects(this.parentOkrId);
  secondOkrKeyResults$: Observable<
    SecondOkrKeyResult[]
  > = this.okrService.getSecondOkrKeyResultsCollection(this.parentOkrId);
  isChildOkrComplete: boolean;
  isChildOkrCompletes = [];
  isSecondOkr: boolean;
  secondOkr: SecondOkr;
  secondOkrKeyResultId: string;
  secondOkrObjectsId = [];

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private route: ActivatedRoute,
    public okrService: OkrService,
    private fb: FormBuilder,
    private datepipe: DatePipe,
    private authService: AuthService,
    private tutorialService: TutorialService
  ) {}

  ngOnInit() {
    combineLatest([this.secondOkrObjects$, this.secondOkrKeyResults$])
      .pipe(take(1))
      .subscribe(([secondOkrObjects, secondOkrKeyResults]) => {
        secondOkrObjects.forEach((secondOkrObject) => {
          this.secondOkrObjects.push(secondOkrObject);
          this.rows[secondOkrObject.secondOkrObjectId] = this.fb.array([]);
          this.parentOkrObjectTitles[
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
    this.okrService.childOkrs$.subscribe((childOkrs) => {
      if (childOkrs.length === 0) {
        this.isSecondOkr = false;
      } else {
        this.isSecondOkr = true;
      }
      childOkrs.map((childOkr) => {
        this.isChildOkrComplete = childOkr.isComplete;
        this.isChildOkrCompletes.push(this.isChildOkrComplete);
        this.isChildOkrCompletes.forEach((childOkrComplete) => {
          if (childOkrComplete === true) {
            this.isChildOkrComplete = true;
          }
        });
        if (childOkr.isComplete === true) {
          this.secondOkr = childOkr;
        }
      });
    });
    // this.determineIfStartingTutorial();
  }

  initSecondOkrObject(secondOkrObject) {
    this.parentOkrObjectTitle = this.fb.group({
      primaryTitle: [
        secondOkrObject.secondOkrObject,
        [Validators.required, Validators.maxLength(20)],
      ],
    });
    this.parentOkrObjectTitles[secondOkrObject.secondOkrObjectId].push(
      this.parentOkrObjectTitle
    );
    this.parentOkrObjectTitle.valueChanges
      .pipe(debounceTime(500))
      .subscribe((secondOkrObjects) => {
        this.updateSecondOkrPrimaryTitle(
          secondOkrObjects.primaryTitle,
          secondOkrObject
        );
      });
  }

  // determineIfStartingTutorial() {
  //   this.tutorialService.startTutorial({
  //     okrType: 'childOkr',
  //     groupIndex: 2,
  //   });
  //   this.tutorialService.tutorial = false;
  // }

  initRows(
    key: string,
    target: number,
    current: number,
    percentage: string,
    lastUpdated: firebase.default.firestore.Timestamp,
    parentOkrObjectId: string,
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
    this.rows[parentOkrObjectId].push(this.row);
    this.editKeyResults(parentOkrObjectId);
  }

  okrId() {
    this.okrService.childOkrs$.subscribe((childOkrs) => {
      childOkrs.forEach((childOkr) => {
        childOkr.secondOkrId;
      });
    });
  }

  addRow(secondOkrObjectId: string) {
    const now = new Date();
    const date = formatDate(now, 'yyyy/MM/dd', this.locale);
    const defaultData = this.fb.group({
      key: ['', [Validators.required, Validators.maxLength(20)]],
      target: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(3),
        ],
      ],
      current: [
        0,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(3),
        ],
      ],
      percentage: [0 + '%', [Validators.required]],
      lastUpdated: [date, [Validators.required]],
    });
    const formData = defaultData.value;
    const subTaskValue: Omit<
      SecondOkrKeyResult,
      'secondOkrKeyResultId' | 'lastUpdated'
    > = {
      secondOkrObjectId,
      secondOkrId: this.parentOkrId,
      key: formData.key,
      target: formData.target,
      current: formData.current,
      percentage: formData.percentage,
      uid: this.authService.uid,
    };
    this.okrService.createSecondOkrKeyResult(
      subTaskValue,
      secondOkrObjectId,
      this.parentOkrId
    );
    this.okrService
      .getSecondOkrKeyResultId(this.parentOkrId)
      .pipe(take(1))
      .subscribe((secondOkrKeyResults) => {
        secondOkrKeyResults.forEach((secondOkrKeyResult) => {
          this.secondOkrKeyResultId = secondOkrKeyResult.secondOkrKeyResultId;
        });
        this.row = this.fb.group({
          key: ['', [Validators.required, Validators.maxLength(20)]],
          target: [
            '',
            [
              Validators.required,
              Validators.pattern('^[0-9]*$'),
              Validators.maxLength(3),
            ],
          ],
          current: [
            0,
            [
              Validators.required,
              Validators.pattern('^[0-9]*$'),
              Validators.maxLength(3),
            ],
          ],
          percentage: [0 + '%', [Validators.required]],
          lastUpdated: [date, [Validators.required]],
          secondOkrKeyResultId: this.secondOkrKeyResultId,
        });
        this.rows[secondOkrObjectId].push(this.row);
        this.editKeyResults(secondOkrObjectId);
      });
  }

  editKeyResults(parentOkrObjectId) {
    this.row.valueChanges
      .pipe(debounceTime(500))
      .subscribe((secondOkrKeyResult) => {
        this.updateSecondOkrKeyResult(
          parentOkrObjectId,
          secondOkrKeyResult.secondOkrKeyResultId,
          secondOkrKeyResult,
          this.rows[parentOkrObjectId].controls.length
        );
      });
  }

  updateSecondOkrKeyResult(
    parentOkrObjectId: string,
    secondOkrKeyResultId: string,
    row: SecondOkrKeyResult,
    rowLength
  ) {
    this.secondOkrKeyResults$.subscribe((secondOkrKeyResults) => {
      let average = 0;
      const secondOkrKeyResultPercentage = secondOkrKeyResults.filter(
        (secondOkrKeyResult) => {
          if (secondOkrKeyResult.secondOkrObjectId === parentOkrObjectId) {
            return secondOkrKeyResult.percentage;
          }
        }
      );
      for (let i = 0; i < secondOkrKeyResultPercentage.length; i++) {
        const subTaskPercentageNumber = secondOkrKeyResultPercentage[
          i
        ].percentage.slice(0, -1);
        if (average + +subTaskPercentageNumber) {
          average = average + +subTaskPercentageNumber;
        } else {
          average = 0;
        }
      }
      const secondOkrObject: Omit<SecondOkrObject, 'secondOkrObject'> = {
        secondOkrObjectId: parentOkrObjectId,
        average: Math.round((average / (rowLength * 100)) * 100),
        uid: this.authService.uid,
      };
      this.okrService.updateSecondOkrObject(
        this.authService.uid,
        this.parentOkrId,
        parentOkrObjectId,
        secondOkrObject
      );
    });

    const target = row.target;
    const current = row.current;
    const percentage = (current / target) * 100;
    let result = 0;
    const formData = row;
    if (Math.round(percentage * 10) / 10) {
      result = Math.round(percentage * 10) / 10;
    } else {
      result = 0;
    }
    const secondOkrKeyResult: Omit<SecondOkrKeyResult, 'lastUpdated'> = {
      secondOkrId: this.parentOkrId,
      secondOkrObjectId: parentOkrObjectId,
      key: formData.key,
      target: formData.target,
      current: formData.current,
      uid: this.authService.uid,
      percentage: result + '%',
    };
    this.okrService.updateSecondOkrKeyResult(
      this.authService.uid,
      this.parentOkrId,
      parentOkrObjectId,
      secondOkrKeyResultId,
      secondOkrKeyResult
    );
  }

  updateSecondOkrPrimaryTitle(
    secondOkrObject,
    secondOkrObjects: SecondOkrObject
  ) {
    this.okrService.updateSecondOkrPrimaryTitle(
      this.authService.uid,
      this.parentOkrId,
      secondOkrObjects.secondOkrObjectId,
      secondOkrObject
    );
  }

  removeRow(secondOkrObjectId: string, rowIndex: number) {
    const secondOkrKeyResultId = this.rows[secondOkrObjectId].value[rowIndex]
      .secondOkrKeyResultId;
    this.okrService.deleteSecondOkrKeyResultDocument(
      this.parentOkrId,
      secondOkrObjectId,
      secondOkrKeyResultId
    );
    this.rows[secondOkrObjectId].removeAt(rowIndex);
  }

  focusNextInput(nextTarget?: number) {
    const nextElement = document.querySelectorAll('.key')[
      nextTarget
    ] as HTMLElement;
    if (nextElement) {
      nextElement.focus();
    }
  }
}
