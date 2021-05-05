import { formatDate } from '@angular/common';
import {
  Component,
  Injectable,
  Inject,
  LOCALE_ID,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import {
  DateRange,
  MatDateRangeSelectionStrategy,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
} from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, take, tap } from 'rxjs/operators';
import { SecondOkr } from 'src/app/interfaces/second-okr';
import { SecondOkrKeyResult } from 'src/app/interfaces/second-okr-key-result';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { OkrService } from 'src/app/services/okr.service';
import { TutorialService } from 'src/app/services/tutorial.service';

@Injectable()
export class FiveDayRangeSelectionStrategy<D>
  implements MatDateRangeSelectionStrategy<D> {
  constructor(private _dateAdapter: DateAdapter<D>) {}

  selectionFinished(date: D | null): DateRange<D> {
    return this._createFiveDayRange(date);
  }

  createPreview(activeDate: D | null): DateRange<D> {
    return this._createFiveDayRange(activeDate);
  }

  private _createFiveDayRange(date: D | null): DateRange<D> {
    if (date) {
      const start = this._dateAdapter.addCalendarDays(date, 0);
      const end = this._dateAdapter.addCalendarDays(date, 90);
      return new DateRange<D>(start, end);
    }

    return new DateRange<D>(null, null);
  }
}
@Component({
  selector: 'app-okr-edit',
  templateUrl: './child-okr-form.component.html',
  styleUrls: ['./child-okr-form.component.scss'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: FiveDayRangeSelectionStrategy,
    },
  ],
})
export class ChildOkrFormComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  objectForm: number = 1;
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
    this.maxDate = new Date(currentYear + 0, currentMouth + 4, currentDate);
  }

  ngOnInit(): void {
    this.addObjective();
    this.checkSecondOkr();
  }

  addObjective() {
    this.primaries.push(
      new FormControl('', [Validators.required, Validators.maxLength(20)])
    );
  }

  checkSecondOkr() {
    this.secondOkrs$.subscribe((secondOkrs) => {
      secondOkrs.forEach((secondOkr) => {
        if (secondOkr.isComplete === true) {
          this.isCompletes = secondOkr.isComplete;
        }
      });
    });
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
    const okrValue: Omit<SecondOkr, 'secondOkrId' | 'isComplete'> = {
      start: createdSecondOkrFormData.start,
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
