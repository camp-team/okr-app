import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup,
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
    primary1: ['', [Validators.required, Validators.maxLength(40)]],
    primary2: ['', [Validators.maxLength(40)]],
    primary3: ['', [Validators.maxLength(40)]],
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
  get primary1Control() {
    return this.form.get('primary1') as FormControl;
  }
  get primary2Control() {
    return this.form.get('primary2') as FormControl;
  }
  get primary3Control() {
    return this.form.get('primary3') as FormControl;
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
      primary1: formData.primary1,
      primary2: formData.primary2,
      primary3: formData.primary3,
      trainerId: this.authService.uid,
    });
  }
  ngOnInit() {}
}
