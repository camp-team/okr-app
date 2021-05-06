import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup,
  FormArray,
} from '@angular/forms';
import { OkrService } from 'src/app/services/okr.service';
import { AuthService } from 'src/app/services/auth.service';
import { Okr } from 'src/app/interfaces/okr';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TutorialService } from 'src/app/services/tutorial.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-parent-okr-form',
  templateUrl: './parent-okr-form.component.html',
  styleUrls: ['./parent-okr-form.component.scss'],
  providers: [],
})
export class ParentOkrFormComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  objectiveEdit: number = 0;
  okrs$: Observable<Okr[]> = this.okrService.getOkrs();
  okrIscomplete: boolean;
  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(40)]],
    primaries: this.fb.array([]),
  });

  get primaries(): FormArray {
    return this.form.get('primaries') as FormArray;
  }
  get titleControl() {
    return this.form.get('title') as FormControl;
  }
  get primariesControl() {
    return this.form.get('primaries') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private okrService: OkrService,
    private authService: AuthService,
    private router: Router,
    private tutorialService: TutorialService,
    private loadingService: LoadingService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.addObjectiveForm();
    this.checkOkr();
  }

  addObjectiveForm() {
    this.primaries.push(
      new FormControl('', [Validators.required, Validators.maxLength(20)])
    );
    this.objectiveEdit = this.objectiveEdit + 1;
  }

  checkOkr() {
    this.okrs$.subscribe((okr) => {
      if (okr.length === 0) {
        this.okrIscomplete = false;
      } else {
        this.okrIscomplete = true;
      }
    });
  }

  secondStepTutorial(num: number) {
    // this.ngAfterViewInit(num);
  }

  // ngAfterViewInit(num: number): void {
  //   this.okrs$.subscribe((okrs) => {
  //     if (!okrs.length) {
  //       switch (num) {
  //         case undefined:
  //           this.tutorialService.startEditTutorial();
  //           break;
  //         case 1:
  //           this.tutorialService.secondStepEditTutorial();
  //           break;
  //       }
  //     }
  //   });
  // }

  removeOption(i: number) {
    this.primaries.removeAt(i);
    this.objectiveEdit = this.objectiveEdit - 1;
  }

  createOkr() {
    this.loadingService.loading = true;
    const formedOkrData = this.form.value;
    const okrValue: Omit<Okr, 'okrId' | 'isComplete'> = {
      title: formedOkrData.title,
      primaries: formedOkrData.primaries,
      creatorId: this.authService.uid,
    };
    const primaryArray = formedOkrData.primaries;
    this.okrService
      .createOkr(okrValue, primaryArray, this.authService.uid)
      .then(() => {
        this.loadingService.loading = false;
        this.router.navigateByUrl('manage/home');
        this.snackBar.open('作成しました');
      });
  }
}
