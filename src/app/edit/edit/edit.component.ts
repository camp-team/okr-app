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
import { MatDialog } from '@angular/material/dialog';
import { CreateFirstOkrDialogComponent } from 'src/app/create-first-okr-dialog/create-first-okr-dialog.component';
import { Observable } from 'rxjs';
import { TutorialService } from 'src/app/services/tutorial.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: [],
})
export class EditComponent implements OnInit {
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
    private dialog: MatDialog,
    private tutorialService: TutorialService
  ) {}

  ngOnInit() {
    this.addOptionForm();
    this.okrs$.subscribe((okr) => {
      if (okr.length === 0) {
        this.okrIscomplete = false;
      } else {
        this.okrIscomplete = true;
      }
    });
  }

  secondEditTutorial(num: number) {
    this.ngAfterViewInit(num);
  }

  ngAfterViewInit(num: number): void {
    this.okrs$.subscribe((okrs) => {
      if (!okrs.length) {
        switch (num) {
          case undefined:
            this.tutorialService.startEditTutorial();
            break;
          case 1:
            this.tutorialService.secondStepEditTutorial();
            break;
        }
      }
    });
  }

  removeOption(i: number) {
    this.primaries.removeAt(i);
    this.objectiveEdit = this.objectiveEdit - 1;
  }

  addOptionForm() {
    this.primaries.push(
      new FormControl('', [Validators.required, Validators.maxLength(20)])
    );
    this.objectiveEdit = this.objectiveEdit + 1;
  }

  submit() {
    const formData = this.form.value;
    const okrValue: Omit<Okr, 'id' | 'isComplete'> = {
      title: formData.title,
      primaries: formData.primaries,
      CreatorId: this.authService.uid,
    };
    const primaryArray = formData.primaries;
    this.okrService
      .createOkr(okrValue, primaryArray, this.authService.uid)
      .then(() => {
        this.router.navigateByUrl('manage/home');
        // this.dialog.open(CreateFirstOkrDialogComponent, {
        //   autoFocus: false,
        //   restoreFocus: false,
        // });
      });
  }
}
