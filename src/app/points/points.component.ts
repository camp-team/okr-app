import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.scss'],
})
export class PointsComponent implements OnInit {
  readonly points = [
    {
      icon: 'format_list_numbered',
      title: '簡単フォーム入力',
      text:
        '簡単なフォーム入力を通して、目標の見える化。汎用性が高く、スピーディに導入できるシステムです。',
    },
    {
      icon: 'table_view',
      title: 'テーブル管理',
      text:
        '進捗の基盤となるデジタル資産として、一元管理。汎用性が高く、スピーディに導入できるシステムです。',
    },
    {
      icon: 'signal_cellular_alt',
      title: '比較と分析',
      text:
        '数値や文字のデータを人が直観的にわかりやすい形で表すことで、データの比較を一目で分かるようにします。',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
