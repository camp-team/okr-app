import { DatePipe, formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { ChildOkr } from 'src/app/interfaces/child-okr';
import { ChildOkrKeyResult } from 'src/app/interfaces/child-okr-key-result';
import { ChildOkrObjective } from 'src/app/interfaces/child-okr-objective';
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
    [childOkrObjectiveId: string]: FormArray;
  } = {};
  childOkrObjectivesForm: {
    [childOkrObjectiveId: string]: FormArray;
  } = {};
  childOkrObjectiveForm: FormGroup;
  childOkrObjectives: ChildOkrObjective[] = [];
  childOkrObjectives$: Observable<
    ChildOkrObjective[]
  > = this.okrService.getChildOkrObjects(this.childOkrId);
  childOkrKeyResults$: Observable<
    ChildOkrKeyResult[]
  > = this.okrService.getChildOkrKeyResultsCollection(this.childOkrId);
  isChildOkrComplete: boolean;
  ischildOkr: boolean;
  childOkr: ChildOkr;
  childOkrKeyResultId: string;
  childOkrs: ChildOkr[];

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
    combineLatest([
      this.childOkrObjectives$,
      this.childOkrKeyResults$,
      this.okrService.childOkrs$,
    ])
      .pipe(take(1))
      .subscribe(([childOkrObjectives, childOkrKeyResults, childOkrs]) => {
        childOkrObjectives.forEach((childOkrObjective) => {
          this.childOkrObjectives.push(childOkrObjective);
          this.rows[childOkrObjective.childOkrObjectiveId] = this.fb.array([]);
          this.childOkrObjectivesForm[
            childOkrObjective.childOkrObjectiveId
          ] = this.fb.array([]);
          this.initializeChildOkrObjectForm(childOkrObjective);
          this.updateChildOkrObjective(childOkrObjective);
        });
        childOkrKeyResults.forEach((childOkrKeyResult) => {
          this.initializeInitRows(childOkrKeyResult);
        });
        this.childOkrs = childOkrs;
        this.checkChildOkr();
      });
    // this.determineIfStartingTutorial();
  }

  initializeChildOkrObjectForm(childOkrObjective: ChildOkrObjective) {
    this.childOkrObjectiveForm = this.fb.group({
      childOkrObjective: [
        childOkrObjective.childOkrObjective,
        [Validators.required, Validators.maxLength(20)],
      ],
    });
    this.childOkrObjectivesForm[childOkrObjective.childOkrObjectiveId].push(
      this.childOkrObjectiveForm
    );
  }

  updateChildOkrObjective(childOkrObjective: ChildOkrObjective) {
    this.childOkrObjectiveForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe((childOkrObjectivesForm) => {
        this.okrService.updateChildOkrObjective({
          childOkrObjective: childOkrObjectivesForm.childOkrObjective,
          uid: this.authService.uid,
          childOkrId: this.childOkrId,
          childOkrObjectiveId: childOkrObjective.childOkrObjectiveId,
        });
      });
  }

  determineIfStartingTutorial() {
    this.tutorialService.startTutorial({
      okrType: 'childOkr',
      groupIndex: 2,
    });
    this.tutorialService.tutorial = false;
  }

  getKeyValidation(key: string) {
    return [key, [Validators.required, Validators.maxLength(20)]];
  }

  getTargetValidation(target: number) {
    return [
      target,
      [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.maxLength(3),
      ],
    ];
  }

  getCurrentValidation(current: number) {
    return [
      current,
      [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.maxLength(3),
      ],
    ];
  }

  getPercentageValidation(percentage: string) {
    return [percentage, [Validators.required]];
  }

  getLastUpdatedValidation(percentage: string) {
    return [percentage, [Validators.required]];
  }

  initializeInitRows(childOkrKeyResult: ChildOkrKeyResult) {
    const lastUpdated = this.datepipe.transform(
      childOkrKeyResult.lastUpdated.toDate(),
      'yyyy/MM/dd'
    );
    this.row = this.fb.group({
      key: this.getKeyValidation(childOkrKeyResult.key),
      target: this.getTargetValidation(childOkrKeyResult.target),
      current: this.getCurrentValidation(childOkrKeyResult.current),
      percentage: this.getPercentageValidation(childOkrKeyResult.percentage),
      lastUpdated: this.getLastUpdatedValidation(lastUpdated),
      childOkrKeyResultId: childOkrKeyResult.childOkrKeyResultId,
    });
    this.rows[childOkrKeyResult.childOkrObjectiveId].push(this.row);
    this.inputChildOkrKeyResults(childOkrKeyResult.childOkrObjectiveId);
  }

  checkChildOkr() {
    if (this.childOkrs.length === 0) {
      this.ischildOkr = false;
    } else {
      this.ischildOkr = true;
    }
    this.childOkrs.forEach((childOkr) => {
      if (childOkr.isChildOkrComplete) {
        this.isChildOkrComplete = true;
      }
      if (childOkr.isChildOkrComplete) {
        this.childOkr = childOkr;
      }
    });
  }

  addRow(childOkrObjectiveId: string) {
    const currentDate = new Date();
    const lastUpdated = formatDate(currentDate, 'yyyy/MM/dd', this.locale);
    const initialForm = this.fb.group({
      key: this.getKeyValidation(''),
      target: this.getTargetValidation(null),
      current: this.getCurrentValidation(0),
      percentage: this.getPercentageValidation(0 + '%'),
      lastUpdated: this.getLastUpdatedValidation(lastUpdated),
    });
    const childOkrKeyResult: Omit<
      ChildOkrKeyResult,
      'childOkrKeyResultId' | 'lastUpdated'
    > = {
      childOkrObjectiveId: childOkrObjectiveId,
      childOkrId: this.childOkrId,
      key: initialForm.value.key,
      target: initialForm.value.target,
      current: initialForm.value.current,
      percentage: initialForm.value.percentage,
      uid: this.authService.uid,
    };
    this.okrService.createChildOkrKeyResult(
      childOkrKeyResult,
      childOkrObjectiveId,
      this.childOkrId
    );
    this.okrService
      .getChildOkrKeyResultId(this.childOkrId)
      .pipe(take(1))
      .subscribe((ChildOkrKeyResults) => {
        ChildOkrKeyResults.forEach((ChildOkrKeyResult) => {
          this.childOkrKeyResultId = ChildOkrKeyResult.childOkrKeyResultId;
        });
        this.row = this.fb.group({
          key: this.getKeyValidation(''),
          target: this.getTargetValidation(null),
          current: this.getCurrentValidation(0),
          percentage: this.getPercentageValidation(0 + '%'),
          lastUpdated: this.getLastUpdatedValidation(lastUpdated),
          childOkrKeyResultId: this.childOkrKeyResultId,
        });
        this.rows[childOkrObjectiveId].push(this.row);
        this.inputChildOkrKeyResults(childOkrObjectiveId);
      });
  }

  inputChildOkrKeyResults(childOkrObjectiveId: string) {
    this.row.valueChanges
      .pipe(debounceTime(500))
      .subscribe((childOkrKeyResult) => {
        this.updateChildOkrKeyResult({
          childOkrObjectiveId,
          childOkrKeyResultId: childOkrKeyResult.childOkrKeyResultId,
          row: childOkrKeyResult,
          rowLength: this.rows[childOkrObjectiveId].controls.length,
        });
      });
  }

  updateChildOkrKeyResult(params: {
    childOkrObjectiveId: string;
    childOkrKeyResultId: string;
    row: ChildOkrKeyResult;
    rowLength: number;
  }) {
    this.childOkrKeyResults$.subscribe((childOkrKeyResults) => {
      let average = 0;
      const childOkrPercentages = childOkrKeyResults.filter(
        (childOkrKeyResult) => {
          if (
            childOkrKeyResult.childOkrObjectiveId === params.childOkrObjectiveId
          ) {
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
      const childOkrObjectiveDate: ChildOkrObjective = {
        childOkrObjectiveId: params.childOkrObjectiveId,
        average: Math.round((average / (params.rowLength * 100)) * 100),
        uid: this.authService.uid,
      };
      this.okrService.updateChildOkrObjectiv({
        uid: this.authService.uid,
        childOkrId: this.childOkrId,
        childOkrObjectiveId: params.childOkrObjectiveId,
        childOkrObjective: childOkrObjectiveDate,
      });
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
    const childOkrKeyResult: Omit<ChildOkrKeyResult, 'lastUpdated'> = {
      childOkrId: this.childOkrId,
      childOkrObjectiveId: params.childOkrObjectiveId,
      key: formData.key,
      target: formData.target,
      current: formData.current,
      uid: this.authService.uid,
      percentage: result + '%',
    };

    this.okrService.updateChildOkrKeyResult({
      uid: this.authService.uid,
      childOkrId: this.childOkrId,
      childOkrObjectiveId: params.childOkrObjectiveId,
      childOkrKeyResultId: params.childOkrKeyResultId,
      childOkrKeyResult,
    });
  }

  removeRow(childOkrObjectiveId: string, rowIndex: number) {
    const childOkrKeyResultId = this.rows[childOkrObjectiveId].value[rowIndex]
      .childOkrKeyResultId;
    this.okrService.deleteChildOkrKeyResultDocument(
      this.childOkrId,
      childOkrObjectiveId,
      childOkrKeyResultId
    );
    this.rows[childOkrObjectiveId].removeAt(rowIndex);
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
