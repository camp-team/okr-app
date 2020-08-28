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
    primary: this.fb.array([]),
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
  get primaryControl() {
    return this.form.get('primary') as FormControl;
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
      primary: formData.primary,
      trainerId: this.authService.uid,
    });
  }

  ngOnInit() {
    this.addOptionForm();
    this.primary.valueChanges.subscribe((res) => {
      console.log(JSON.stringify(this.form.value));
    });
  }

  removeOption(i: number) {
    this.primary.removeAt(i);
  }

  addOptionForm() {
    this.primary.push(
      new FormControl('', [Validators.required, Validators.maxLength(40)])
    );
  }

  get primary(): FormArray {
    return this.form.get('primary') as FormArray;
  }
}
