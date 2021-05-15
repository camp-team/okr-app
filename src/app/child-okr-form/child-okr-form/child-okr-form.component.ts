import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { debounceTime, tap } from 'rxjs/operators';
import { SecondOkr } from 'src/app/interfaces/second-okr';
import { SecondOkrKeyResult } from 'src/app/interfaces/second-okr-key-result';
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
  minDate: Date;
  maxDate: Date;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  objectForm: number = 3;
  isChildOkrCompletes: boolean;
  form = this.fb.group({
    primaries: this.fb.array([]),
    end: ['', [Validators.required, Validators.maxLength(40)]],
  });

  get primaries(): FormArray {
    return this.form.get('primaries') as FormArray;
  }
  get endControl() {
    return this.form.get('end') as FormControl;
  }
  get primariesControl() {
    return this.form.get('primaries') as FormControl;
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
  }

  ngOnInit(): void {
    this.initObjective();
    this.checkSecondOkr();
    // this.determineIfStartingTutorial();
  }

  initObjective() {
    for (let i = 0; i < 3; i++) {
      this.primaries.push(
        new FormControl('', [Validators.required, Validators.maxLength(20)])
      );
    }
  }

  checkSecondOkr() {
    this.okrService.childOkrs$.subscribe((childOkrs) => {
      childOkrs.forEach((childOkr) => {
        if (childOkr.isComplete === true) {
          this.isChildOkrCompletes = childOkr.isComplete;
        }
      });
    });
  }

  myFilter = (date: Date) => {
    const calenderYear = (date || new Date()).getFullYear();
    const nowYear = new Date().getFullYear();
    return calenderYear >= nowYear && calenderYear <= nowYear + 1;
  };

  addObjective() {
    this.primaries.push(
      new FormControl('', [Validators.required, Validators.maxLength(20)])
    );
  }

  // determineIfStartingTutorial() {
  //   this.tutorialService.startTutorial({
  //     okrType: 'childOkr',
  //     groupIndex: 1,
  //   });
  // }

  removeObjectiveForm(i: number) {
    this.primaries.removeAt(i);
    this.objectForm = this.objectForm - 1;
  }

  addObjectiveForm() {
    this.primaries.push(
      new FormControl('', [Validators.required, Validators.maxLength(20)])
    );
    this.objectForm = this.objectForm + 1;
  }

  cleateSecondOkr() {
    this.loadingService.loading = true;
    const createdSecondOkrFormData = this.form.value;
    const okrValue: Omit<SecondOkr, 'secondOkrId' | 'isComplete' | 'start'> = {
      end: createdSecondOkrFormData.end,
      creatorId: this.authService.uid,
      secondOkrObjects: createdSecondOkrFormData.primaries,
    };
    const kyeResult = this.secondOkrKeyResults();
    const primaryArray = createdSecondOkrFormData.primaries;
    this.okrService
      .createSecondOkr(okrValue, primaryArray, kyeResult)
      .then(() => {
        this.okrService
          .getSecondOkrId()
          .pipe(
            tap(() => (this.loadingService.loading = true)),
            debounceTime(400)
          )
          .subscribe((secondOkrs) => {
            secondOkrs.forEach((secondOkr) => {
              this.loadingService.loading = false;
              this.snackBar.open('作成しました', null);
              this.router.navigate(['manage/secondOkr'], {
                queryParams: { v: secondOkr.secondOkrId },
              });
            });
          });
      });
  }

  secondOkrKeyResults() {
    const now = new Date();
    const date = formatDate(now, 'yyyy/MM/dd', this.locale);
    const defaultSecondOkrData = this.fb.group({
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
    const defaultSecondOkrFormData = defaultSecondOkrData.value;
    const defaultSecondOkrValue: Omit<
      SecondOkrKeyResult,
      | 'secondOkrKeyResultId'
      | 'lastUpdated'
      | 'secondOkrObjectId'
      | 'secondOkrId'
    > = {
      key: defaultSecondOkrFormData.key,
      target: defaultSecondOkrFormData.target,
      current: defaultSecondOkrFormData.current,
      percentage: defaultSecondOkrFormData.percentage,
      uid: this.authService.uid,
    };
    return defaultSecondOkrValue;
  }

  secondOkr() {
    this.okrService.childOkrs$.subscribe((childOkrs) => {
      const childOkr = childOkrs.filter(
        (childOkr) => childOkr.isComplete === true
      );
      this.router.navigateByUrl(
        '/manage/secondOkr?v=' + childOkr[0].secondOkrId
      );
    });
  }
}
