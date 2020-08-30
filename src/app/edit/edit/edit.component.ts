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
    private authService: AuthService
  ) {}

  submit() {
    console.log(this.form.value);
    const formData = this.form.value;
    this.okrService.editOkr({
      title: formData.title,
      start: formData.start,
      end: formData.end,
      primaries: formData.primaries,
      trainerId: this.authService.uid,
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
