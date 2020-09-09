import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Okr } from '../interfaces/okr';
import { OkrService } from '../services/okr.service';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import {
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';

@Component({
  selector: 'app-home-detail',
  templateUrl: './home-detail.component.html',
  styleUrls: ['./home-detail.component.scss'],
})
export class HomeDetailComponent implements OnInit {
  okr$: Observable<Okr>;

  form = this.fb.group({
    primaries: this.fb.array([]),
  });

  get primariesControl() {
    return this.form.get('primaries') as FormControl;
  }

  constructor(
    private route: ActivatedRoute,
    public okrService: OkrService,
    private fb: FormBuilder
  ) {
    this.route.paramMap
      .pipe(
        switchMap((map) => {
          const id = map.get('id');
          console.log(id);
          return id ? this.okrService.getOkr(id) : of(null);
        })
      )
      .subscribe((okr) => {
        this.form.patchValue(okr);
        console.log(okr);
        okr.primaries.forEach((primary) => {
          console.log(primary);
          this.primaries.push(
            new FormControl(primary, [
              Validators.required,
              Validators.maxLength(40),
            ])
          );
        });
      });
  }

  get primaries(): FormArray {
    return this.form.get('primaries') as FormArray;
  }

  rename() {
    console.log(this.form.value);
    this.okrService.updateOkr(this.form.value);
  }

  ngOnInit() {
    this.okr$ = this.route.paramMap.pipe(
      switchMap((map) => {
        const id = map.get('id');
        console.log(id);
        return this.okrService.getOkr(id);
      })
    );
  }
}
