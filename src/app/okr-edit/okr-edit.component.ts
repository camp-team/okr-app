import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NextOkr } from '../interfaces/next-okr';
import { Okr } from '../interfaces/okr';
import { AuthService } from '../services/auth.service';
import { OkrService } from '../services/okr.service';

@Component({
  selector: 'app-okr-edit',
  templateUrl: './okr-edit.component.html',
  styleUrls: ['./okr-edit.component.scss'],
})
export class OkrEditComponent implements OnInit {
  form = this.fb.group({
    start: ['', [Validators.required, Validators.maxLength(40)]],
    end: ['', [Validators.required, Validators.maxLength(40)]],
    primaries: this.fb.array([]),
  });

  get primaries(): FormArray {
    return this.form.get('primaries') as FormArray;
  }
  get start() {
    return this.form.get('start') as FormControl;
  }
  get end() {
    return this.form.get('start') as FormControl;
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
      new FormControl('', [Validators.required, Validators.maxLength(40)])
    );
  }

  cleateOKR() {
    const formData = this.form.value;
    const okrValue: Omit<NextOkr, 'id' | 'isComplete'> = {
      start: formData.start,
      primaries: formData.primaries,
      end: formData.end,
      CreatorId: this.authService.uid,
    };
    console.log(formData.primaries);
    const primaryArray = formData.primaries;
    this.okrService.createNextOkr(okrValue, primaryArray).then(() => {
      this.snackBar.open('作成しました', null);
      this.router.navigateByUrl('manage/home/homedetail');
    });
  }
}