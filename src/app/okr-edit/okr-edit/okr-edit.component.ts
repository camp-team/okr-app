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
import { Observable } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { SecondOkr } from 'src/app/interfaces/second-okr';
import { SecondOkrKeyResult } from 'src/app/interfaces/second-okr-key-result';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { OkrService } from 'src/app/services/okr.service';
import { TutorialService } from 'src/app/services/tutorial.service';

@Component({
  selector: 'app-okr-edit',
  templateUrl: './okr-edit.component.html',
  styleUrls: ['./okr-edit.component.scss'],
})
export class OkrEditComponent implements OnInit {
  minDate: Date;
  maxDate: Date;

  objectForm: number = 1;

  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  secondOkrs$: Observable<SecondOkr[]> = this.okrService.getSecondOkrs();
  isCompletes: boolean;

  myFilter = (date: Date) => {
    const calenderYear = (date || new Date()).getFullYear();
    const nowYear = new Date().getFullYear();
    return calenderYear >= nowYear && calenderYear <= nowYear + 1;
  };

  form = this.fb.group({
    primaries: this.fb.array([]),
    start: ['', [Validators.required, Validators.maxLength(40)]],
    end: ['', [Validators.required, Validators.maxLength(40)]],
  });

  get primaries(): FormArray {
    return this.form.get('primaries') as FormArray;
  }
  get startControl() {
    return this.form.get('start') as FormControl;
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
    this.secondOkrs$.subscribe((secondOkrs) => {
      secondOkrs.forEach((secondOkr) => {
        if (secondOkr.isComplete === true) {
          this.isCompletes = secondOkr.isComplete;
        }
      });
    });
    this.addObjective();
  }

  secondStepOkr(num) {
    this.ngAfterViewInit(num);
  }

  ngAfterViewInit(num: number) {
    this.secondOkrs$.pipe(take(1)).subscribe((secondOkrs) => {
      if (secondOkrs.length === 0) {
        switch (num) {
          case undefined:
            this.tutorialService.firstStepSecondOkrEditTutorial();
            break;
          case 1:
            this.tutorialService.secondStepSecondOkrEditTutorial();
            break;
        }
      }
    });
  }

  addObjective() {
    this.primaries.push(
      new FormControl('', [Validators.required, Validators.maxLength(20)])
    );
  }

  removeOption(i: number) {
    this.primaries.removeAt(i);
    this.objectForm = this.objectForm - 1;
  }

  addOptionForm() {
    this.primaries.push(
      new FormControl('', [Validators.required, Validators.maxLength(20)])
    );
    this.objectForm = this.objectForm + 1;
  }

  cleateSecondOkr() {
    this.loadingService.loading = true;
    const formData = this.form.value;
    const okrValue: Omit<SecondOkr, 'secondOkrId' | 'isComplete'> = {
      start: formData.start,
      end: formData.end,
      creatorId: this.authService.uid,
      secondOkrObjects: formData.primaries,
    };
    const kyeResult = this.secondOkrKeyResults();
    const primaryArray = formData.primaries;
    this.okrService
      .createSecondOkr(okrValue, primaryArray, kyeResult)
      .then(() => {
        this.okrService
          .getSecondOkrId()
          .pipe(debounceTime(400))
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
      | 'secondOkrKeyResultId'
      | 'lastUpdated'
      | 'secondOkrObjectId'
      | 'secondOkrId'
    > = {
      key: formData.key,
      target: formData.target,
      current: formData.current,
      percentage: formData.percentage,
      uid: this.authService.uid,
    };
    return subTaskValue;
  }

  secondOkr() {
    this.secondOkrs$.subscribe((secondOkrs) => {
      const secondOkr = secondOkrs.filter(
        (secondOkr) => secondOkr.isComplete === true
      );
      this.router.navigateByUrl(
        '/manage/secondOkr?v=' + secondOkr[0].secondOkrId
      );
    });
  }
}
