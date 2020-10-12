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
import { Primary } from 'src/app/interfaces/primary';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: [],
})
export class EditComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(40)]],
    start: ['', [Validators.required, Validators.maxLength(40)]],
    end: ['', [Validators.required, Validators.maxLength(40)]],
    primaries: this.fb.array([]),
  });

  get titleControl() {
    return this.form.get('title') as FormControl;
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

  submit() {
    const formData = this.form.value;
    const okrValue: Omit<Okr, 'id'> = {
      title: formData.title,
      start: formData.start,
      primaries: formData.primaries,
      end: formData.end,
      CreatorId: this.authService.uid,
    };
    const primaryArray = formData.primaries;
    this.okrService.createOkr(okrValue, primaryArray).then(() => {
      this.snackBar.open('作成しました', null, {
        duration: 2000,
      });
      this.router.navigateByUrl('manage/home');
    });
  }

  ngOnInit() {
    this.addOptionForm();
  }

  removeOption(i: number) {
    this.primaries.removeAt(i);
  }

  addOptionForm() {
    this.primaries.push(
      new FormControl('', [Validators.required, Validators.maxLength(40)])
    );
  }

  get primaries(): FormArray {
    return this.form.get('primaries') as FormArray;
  }
}
