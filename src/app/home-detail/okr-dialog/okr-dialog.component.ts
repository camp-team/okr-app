import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubTask } from 'src/app/interfaces/sub-task';
@Component({
  selector: 'app-okr-dialog',
  templateUrl: './okr-dialog.component.html',
  styleUrls: ['./okr-dialog.component.scss'],
})
export class OkrDialogComponent implements OnInit {
  subTasks = this.data;

  readonly lists = [
    {
      menu: 'target',
      text: 'テスト',
    },
    {
      menu: 'current',
      text: 'テスト',
    },
    {
      menu: 'percentage',
      text: 'テスト',
    },
    {
      menu: 'lastUpdated',
      text: 'テスト',
    },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: SubTask[]
  ) {}

  ngOnInit(): void {}
}
