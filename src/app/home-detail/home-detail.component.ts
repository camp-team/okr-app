import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Okr } from '../interfaces/okr';
import { OkrService } from '../services/okr.service';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-home-detail',
  templateUrl: './home-detail.component.html',
  styleUrls: ['./home-detail.component.scss'],
})
export class HomeDetailComponent implements OnInit {
  okr$: Observable<Okr>;

  // formArray
  tableForm = this.fb.array([]);

  // formgroup
  row = this.fb.group({
    title: ['', [Validators.required]],
    target: ['', [Validators.required]],
    current: ['', [Validators.required]],
    percentage: ['', [Validators.required]],
    lastupdata: ['', [Validators.required]],
  });

  removeRow(index: number) {
    this.tableForm.removeAt(index);
  }

  constructor(
    private route: ActivatedRoute,
    public okrService: OkrService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.okr$ = this.route.paramMap.pipe(
      switchMap((map) => {
        const id = map.get('id');
        return this.okrService.getOkr(id);
      })
    );
  }

  // レコード追加
  addRow() {
    this.tableForm.push(this.row);
    console.log(this.row);
  }
}
