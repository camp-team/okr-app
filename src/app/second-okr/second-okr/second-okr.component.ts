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
  private childOkrId = this.route.snapshot.queryParamMap.get('id');
  row: FormGroup;
  rows: {
    [childOkrObjectId: string]: FormArray;
  } = {};
  childOkrObjectivesForm: {
    [childOkrObjectId: string]: FormArray;
  } = {};
  childOkrObjectiveForm: FormGroup;
  childOkrObjectives: SecondOkrObject[] = [];
  childOkrObjectives$: Observable<
    SecondOkrObject[]
  > = this.okrService.getSecondOkrObjects(this.childOkrId);
  childOkrKeyResults$: Observable<
    SecondOkrKeyResult[]
  > = this.okrService.getSecondOkrKeyResultsCollection(this.childOkrId);
  isChildOkrComplete: boolean;
  isChildOkrCompletes = [];
  ischildOkr: boolean;
  childOkr: SecondOkr;
  childOkrKeyResultId: string;

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
    combineLatest([this.childOkrObjectives$, this.childOkrKeyResults$])
      .pipe(take(1))
      .subscribe(([childOkrObjectives, childOkrKeyResults]) => {
        childOkrObjectives.forEach((childOkrObjective) => {
          this.childOkrObjectives.push(childOkrObjective);
          this.rows[childOkrObjective.secondOkrObjectId] = this.fb.array([]);
          this.childOkrObjectivesForm[
            childOkrObjective.secondOkrObjectId
          ] = this.fb.array([]);
          this.initializeChildOkrObject(childOkrObjective);
        });
        childOkrKeyResults.forEach((childOkrKeyResult) => {
          this.initializeInitRows({
            key: childOkrKeyResult.key,
            target: childOkrKeyResult.target,
            current: childOkrKeyResult.current,
            percentage: childOkrKeyResult.percentage,
            lastUpdated: childOkrKeyResult.lastUpdated,
            childOkrObjectId: childOkrKeyResult.secondOkrObjectId,
            childOkrKeyResultId: childOkrKeyResult.secondOkrKeyResultId,
          });
        });
      });
    this.okrService.childOkrs$.subscribe((childOkrs) => {
      if (childOkrs.length === 0) {
        this.ischildOkr = false;
      } else {
        this.ischildOkr = true;
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
          this.childOkr = childOkr;
        }
      });
    });
    // this.determineIfStartingTutorial();
  }

  initializeChildOkrObject(childOkrObjective: SecondOkrObject) {
    this.childOkrObjectiveForm = this.fb.group({
      childOkrObjective: [
        childOkrObjective.secondOkrObject,
        [Validators.required, Validators.maxLength(20)],
      ],
    });
    this.childOkrObjectivesForm[childOkrObjective.secondOkrObjectId].push(
      this.childOkrObjectiveForm
    );
    this.childOkrObjectiveForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe((childOkrObjectivesForm) => {
        this.updateChildOkrObjective(
          childOkrObjectivesForm.childOkrObjective,
          childOkrObjective
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

  initializeInitRows(params: {
    key: string;
    target: number;
    current: number;
    percentage: string;
    lastUpdated: firebase.default.firestore.Timestamp;
    childOkrObjectId: string;
    childOkrKeyResultId: string;
  }) {
    const lastUpdated = this.datepipe.transform(
      params.lastUpdated.toDate(),
      'yyyy/MM/dd'
    );
    this.row = this.fb.group({
      key: [params.key, [Validators.required, Validators.maxLength(20)]],
      target: [
        params.target,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(3),
        ],
      ],
      current: [
        params.current,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(3),
        ],
      ],
      percentage: [params.percentage, [Validators.required]],
      lastUpdated: [lastUpdated, [Validators.required]],
      secondOkrKeyResultId: params.childOkrKeyResultId,
    });
    this.rows[params.childOkrObjectId].push(this.row);
    this.inputChildOkrKeyResults(params.childOkrObjectId);
  }

  addRow(childOkrObjectId: string) {
    const currentDate = new Date();
    const lastUpdated = formatDate(currentDate, 'yyyy/MM/dd', this.locale);
    const initialForm = this.fb.group({
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
      lastUpdated: [lastUpdated, [Validators.required]],
    });
    const childOkrKeyResult: Omit<
      SecondOkrKeyResult,
      'secondOkrKeyResultId' | 'lastUpdated'
    > = {
      secondOkrObjectId: childOkrObjectId,
      secondOkrId: this.childOkrId,
      key: initialForm.value.key,
      target: initialForm.value.target,
      current: initialForm.value.current,
      percentage: initialForm.value.percentage,
      uid: this.authService.uid,
    };
    this.okrService.createChildOkrKeyResult(
      childOkrKeyResult,
      childOkrObjectId,
      this.childOkrId
    );
    this.okrService
      .getSecondOkrKeyResultId(this.childOkrId)
      .pipe(take(1))
      .subscribe((secondOkrKeyResults) => {
        secondOkrKeyResults.forEach((secondOkrKeyResult) => {
          this.childOkrKeyResultId = secondOkrKeyResult.secondOkrKeyResultId;
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
          lastUpdated: [lastUpdated, [Validators.required]],
          secondOkrKeyResultId: this.childOkrKeyResultId,
        });
        this.rows[childOkrObjectId].push(this.row);
        this.inputChildOkrKeyResults(childOkrObjectId);
      });
  }

  inputChildOkrKeyResults(childOkrObjectId: string) {
    this.row.valueChanges
      .pipe(debounceTime(500))
      .subscribe((childOkrKeyResult) => {
        this.updateSecondOkrKeyResult({
          childOkrObjectId: childOkrObjectId,
          childOkrKeyResultId: childOkrKeyResult.secondOkrKeyResultId,
          row: childOkrKeyResult,
          rowLength: this.rows[childOkrObjectId].controls.length,
        });
      });
  }

  updateSecondOkrKeyResult(params: {
    childOkrObjectId: string;
    childOkrKeyResultId: string;
    row: SecondOkrKeyResult;
    rowLength: number;
  }) {
    this.childOkrKeyResults$.subscribe((childOkrKeyResults) => {
      let average = 0;
      const childOkrPercentages = childOkrKeyResults.filter(
        (childOkrKeyResult) => {
          if (childOkrKeyResult.secondOkrObjectId === params.childOkrObjectId) {
            return childOkrKeyResult.percentage;
          }
        }
      );
      for (let i = 0; i < childOkrPercentages.length; i++) {
        const childOkrPercentage = childOkrPercentages[i].percentage.slice(
          0,
          -1
        );
        if (average + +childOkrPercentage) {
          average = average + +childOkrPercentage;
        } else {
          average = 0;
        }
      }
      const childOkrObjectiveDate: Omit<SecondOkrObject, 'secondOkrObject'> = {
        secondOkrObjectId: params.childOkrObjectId,
        average: Math.round((average / (params.rowLength * 100)) * 100),
        uid: this.authService.uid,
      };
      this.okrService.updateSecondOkrObject(
        this.authService.uid,
        this.childOkrId,
        params.childOkrObjectId,
        childOkrObjectiveDate
      );
    });

    const target = params.row.target;
    const current = params.row.current;
    const percentage = (current / target) * 100;
    let result = 0;
    const formData = params.row;
    if (Math.round(percentage * 10) / 10) {
      result = Math.round(percentage * 10) / 10;
    } else {
      result = 0;
    }
    const childOkrKeyResult: Omit<SecondOkrKeyResult, 'lastUpdated'> = {
      secondOkrId: this.childOkrId,
      secondOkrObjectId: params.childOkrObjectId,
      key: formData.key,
      target: formData.target,
      current: formData.current,
      uid: this.authService.uid,
      percentage: result + '%',
    };
    this.okrService.updateSecondOkrKeyResult({
      uid: this.authService.uid,
      childOkrId: this.childOkrId,
      childOkrObjectId: params.childOkrObjectId,
      childOkrKeyResultId: params.childOkrKeyResultId,
      childOkrKeyResult: childOkrKeyResult,
    });
  }

  updateChildOkrObjective(
    childOkrObject: SecondOkrObject,
    childOkrObjects: SecondOkrObject
  ) {
    this.okrService.updateChildOkrObjective({
      childOkrObjective: childOkrObject,
      uid: this.authService.uid,
      childOkrId: this.childOkrId,
      childOkrObjectId: childOkrObjects.secondOkrObjectId,
    });
  }

  removeRow(secondOkrObjectId: string, rowIndex: number) {
    const childOkrKeyResultId = this.rows[secondOkrObjectId].value[rowIndex]
      .secondOkrKeyResultId;
    this.okrService.deleteSecondOkrKeyResultDocument(
      this.childOkrId,
      secondOkrObjectId,
      childOkrKeyResultId
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
