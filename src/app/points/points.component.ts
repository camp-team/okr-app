import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.scss'],
})
export class PointsComponent implements OnInit {
  readonly points = [
    {
      icon: 'supervisor_account',
      title: '短期間',
      text:
        'テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト ',
    },
    {
      icon: 'supervisor_account',
      title: '短期間',
      text:
        'テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト ',
    },
    {
      icon: 'supervisor_account',
      title: '短期間',
      text:
        'テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト テスト ',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
