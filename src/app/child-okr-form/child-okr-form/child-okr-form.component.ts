import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { debounceTime, tap } from 'rxjs/operators';
import { ChildOkr } from 'src/app/interfaces/child-okr';
import { ChildOkrKeyResult } from 'src/app/interfaces/child-okr-key-result';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { OkrService } from 'src/app/services/okr.service';
import { TutorialService } from 'src/app/services/tutorial.service';
@Component({
  selector: 'app-child-okr-form',
  templateUrl: './child-okr-form.component.html',
  styleUrls: ['./child-okr-form.component.scss'],
})
export class ChildOkrFormComponent implements OnInit {
  childOkrs: ChildOkr[];
  minDate: Date;
  maxDate: Date;
  objectiveForm: number = 3;
  isChildOkrCompletes: boolean;
  childOkrForm = this.fb.group({
    objectives: this.fb.array([]),
    end: ['', [Validators.required, Validators.maxLength(40)]],
  });

  get objectives(): FormArray {
    return this.childOkrForm.get('objectives') as FormArray;
  }
  get endControl() {
    return this.childOkrForm.get('end') as FormControl;
  }

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private okrService: OkrService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private tutorialService: TutorialService,
    private loadingService: LoadingService
  ) {
    const currentYear = new Date().getFullYear();
    const currentMouth = new Date().getMonth();
    const currentDate = new Date().getDate();
    this.minDate = new Date(currentYear - 0, currentMouth, currentDate);
    this.maxDate = new Date(currentYear + 0, currentMouth + 3, currentDate);
    this.okrService.childOkrs$.subscribe((childOkrs) => {
      this.childOkrs = childOkrs;
      this.checkChildOkr();
    });
    this.displayToInitialObjectiveForm();
  }

  ngOnInit(): void {
    // this.determineIfStartingTutorial();
  }

  displayToInitialObjectiveForm() {
    for (let i = 0; i < 3; i++) {
      this.objectives.push(
        new FormControl('', [Validators.required, Validators.maxLength(20)])
      );
    }
  }

  checkChildOkr() {
    this.childOkrs.forEach((childOkr) => {
      if (childOkr.isChildOkrComplete) {
        this.isChildOkrCompletes = true;
      }
    });
  }

  // determineIfStartingTutorial() {
  //   this.tutorialService.startTutorial({
  //     okrType: 'childOkr',
  //     groupIndex: 1,
  //   });
  // }

  removeObjectiveForm(i: number) {
    this.objectives.removeAt(i);
    this.objectiveForm--;
  }

  addObjectiveForm() {
    this.objectives.push(
      new FormControl('', [Validators.required, Validators.maxLength(20)])
    );
    this.objectiveForm++;
  }

  cleateChildOkr() {
    this.loadingService.loading = true;
    const childOkrObjectiveFormInformation = this.childOkrForm.value;
    const childOkrObjective: Omit<
      ChildOkr,
      'childOkrId' | 'isChildOkrComplete' | 'start'
    > = {
      end: childOkrObjectiveFormInformation.end,
      childOkrObjectives: childOkrObjectiveFormInformation.objectives,
      uid: this.authService.uid,
    };
    const childInitialOkrKeyResultsForm = this.getInitialChildOkrKeyResultsForm();
    const childOkrObjectives = childOkrObjectiveFormInformation.objectives;
    this.okrService
      .createChildOkr({
        childOkr: childOkrObjective,
        Objectives: childOkrObjectives,
        initialForm: childInitialOkrKeyResultsForm,
      })
      .then(() => {
        this.okrService
          .getChildOkrInProgress()
          .pipe(
            tap(() => (this.loadingService.loading = true)),
            debounceTime(400)
          )
          .subscribe((childOkrInProgress) => {
            this.loadingService.loading = false;
            this.snackBar.open('作成しました', null);
            this.router.navigate(['manage/secondOkr'], {
              queryParams: { id: childOkrInProgress[0].childOkrId },
            });
          });
      });
  }

  getInitialChildOkrKeyResultsForm() {
    const now = new Date();
    const date = formatDate(now, 'yyyy/MM/dd', this.locale);
    const initialChildOkrForm = this.fb.group({
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
    const initialChildOkr: Omit<
      ChildOkrKeyResult,
      | 'childOkrKeyResultId'
      | 'lastUpdated'
      | 'childOkrObjectiveId'
      | 'childOkrId'
    > = {
      key: initialChildOkrForm.value.key,
      target: initialChildOkrForm.value.target,
      current: initialChildOkrForm.value.current,
      percentage: initialChildOkrForm.value.percentage,
      uid: this.authService.uid,
    };
    return initialChildOkr;
  }

  moveToChildOkrOfProgress() {
    const childOkrInProgress = this.childOkrs.filter(
      (childOkr) => (childOkr.isChildOkrComplete = true)
    );
    this.router.navigateByUrl(
      '/manage/secondOkr?id=' + childOkrInProgress[0].childOkrId
    );
  }
}
