import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Okr } from '../interfaces/okr';
import { OkrService } from '../services/okr.service';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import {
  FormArray,
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

  // tableのフォームを配列で持たせておく
  tableForms = [];

  // formArray
  tableForm: FormArray = this.fb.array([]);

  addRow(i) {
    const row = this.fb.group({
      title: ['', [Validators.required]],
      target: ['', [Validators.required]],
      current: ['', [Validators.required]],
      percentage: ['', [Validators.required]],
      lastUpdated: ['', [Validators.required]],
    });
    this.tableForm.push(row);
  }

  get rows(): FormGroup[] {
    return this.tableForm.controls as FormGroup[];
  }

  removeRow(index: number) {
    this.tableForm.removeAt(index);
  }

  constructor(
    private route: ActivatedRoute,
    public okrService: OkrService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    // オブザーバブルを使い、URLからOkrsを流すmapはreturn
    this.okr$ = this.route.paramMap.pipe(
      // 別のオブザーバブルに変える
      switchMap((map) => {
        // mapでidを文字列として取得
        const id = map.get('id');
        console.log(id);
        return this.okrService.getOkr(id);
      })
    );
    // subscribeでokrsを取得
    this.okr$.subscribe((okrs) => console.log(okrs));
    // i番目のprimariesが入ってきた時のrowを作成
    this.okr$.forEach((primaries) => {
      const tableForm = this.fb.array([]);
      this.tableForms.push(tableForm);
      console.log(tableForm);
    });
  }

  // サブスクライブで取得したokrsの中のprimariesをループ
  // okr.primaries.forEach((primary) => {
  //   const tableForm = this.fb.array([]);
  //   this.tableForms.push(tableForm);
  // });

  // i番目のテーブルのレコードを追加
  // addRow(i: number) {
  // formArray(行)に対するpush
  //   this.tableForm[i].push(this.row);
  //   console.log(this.row);
  // }
}
