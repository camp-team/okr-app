import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SecondOkr } from 'src/app/interfaces/second-okr';
import { AuthService } from 'src/app/services/auth.service';
import { OkrService } from 'src/app/services/okr.service';

@Component({
  selector: 'app-okr-edit',
  templateUrl: './okr-edit.component.html',
  styleUrls: ['./okr-edit.component.scss'],
})
export class OkrEditComponent implements OnInit {
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

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
    private fb: FormBuilder,
    private okrService: OkrService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addObjective();
  }

  addObjective() {
    this.primaries.push(
      new FormControl('', [Validators.required, Validators.maxLength(20)])
    );
  }

  removeOption(i: number) {
    this.primaries.removeAt(i);
  }

  addOptionForm() {
    this.primaries.push(
      new FormControl('', [Validators.required, Validators.maxLength(20)])
    );
  }

  cleateOKR() {
    const formData = this.form.value;
    const okrValue: Omit<SecondOkr, 'id' | 'isComplete'> = {
      start: formData.start,
      end: formData.end,
      creatorId: this.authService.uid,
      secondOkrObjects: formData.primaries,
    };
    const primaryArray = formData.primaries;
    this.okrService.createSecondOkr(okrValue, primaryArray).then(() => {
      this.okrService.getSecondOkrs().subscribe((secondOkrs) => {
        secondOkrs.forEach((secondOkr) => {
          this.snackBar.open('作成しました', null);
          this.router.navigate(['manage/home/secondOkr'], {
            queryParams: { v: secondOkr.id },
          });
        });
      });
    });
  }
}
