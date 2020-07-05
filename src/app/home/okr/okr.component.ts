import { Component, OnInit, Input } from '@angular/core';
import { Okr } from 'src/app/interfaces/okr';

@Component({
  selector: 'app-okr',
  templateUrl: './okr.component.html',
  styleUrls: ['./okr.component.scss'],
})
export class OkrComponent implements OnInit {
  @Input() okr: Okr;

  constructor() {}

  ngOnInit(): void {}
}
