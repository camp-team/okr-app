import { Component, OnInit } from '@angular/core';
import { Okr } from 'src/app/interfaces/okr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  okr: Okr = {
    title: 'タイトル:　',
    duration: '期間:　',
    primary1: '',
    primary2: '',
    primary3: '',
    trainerId: '',
  };

  constructor() {}

  ngOnInit(): void {}
}
