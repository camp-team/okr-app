import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(40)]],
    duration: ['', [Validators.required, Validators.maxLength(40)]],
    primary1: ['', [Validators.required, Validators.maxLength(40)]],
    primary2: ['', [Validators.required, Validators.maxLength(40)]],
    primary3: ['', [Validators.required, Validators.maxLength(40)]],
  });

  get titleControl() {
    return this.form.get('title') as FormControl;
  }
  get durationControl() {
    return this.form.get('duration') as FormControl;
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

  constructor(private fb: FormBuilder) {}

  submit() {
    console.log(this.form.value);
  }
  ngOnInit() {}
}
