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
    title: ['', [Validators.required, Validators.maxLength(40)]],
    start: ['', [Validators.required, Validators.maxLength(40)]],
    end: ['', [Validators.required, Validators.maxLength(40)]],
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
        okr.primaries.forEach((primary) =>
          this.primaries.push({
            primary: [primary, [Validators.required]],
          })
        );
      });
  }

  get primaries(): FormArray {
    return this.form.get('primaries') as FormArray;
  }

  // addPrimary(primary?: Primary) {
  //   console.log(primary);
  // const formGroup = this.fb.group({
  //   primary: [primary?.primary || '', [Validators.required]],
  // });
  // console.log(formGroup);
  //   this.primaries.push(primary);
  // }

  rename() {
    this.okr$ = this.route.paramMap.pipe(
      switchMap((map) => {
        const id = map.get('id');
        return this.okrService.getOkr(id);
      })
    );
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
