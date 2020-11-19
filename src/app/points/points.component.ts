import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.scss'],
})
export class PointsComponent implements OnInit {
  readonly points = [
    {
      icon: 'edit',
      title: '成果',
      text: '個人の目標に紐づいた複数の中規模・小規模な成果を設定します。',
    },
    {
      icon: 'save_alt',
      title: '創造性',
      text:
        '目標が明確になり、自分の果たす役割が明らかになり、無駄な思想や混乱を削減します。',
    },
    {
      icon: 'show_chart',
      title: '可視化',
      text:
        '数値や文字のデータを人が直観的にわかりやすい形で表すことで、データの比較を一目で分かるようにします。',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
