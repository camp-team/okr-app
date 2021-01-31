import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
      text: this.data[0].target,
    },
    {
      menu: 'current',
      text: this.data[0].current,
    },
    {
      menu: 'percentage',
      text: this.data[0].percentage,
    },
    {
      menu: 'lastUpdated',
      text: 'テスト',
    },
  ];

  constructor(
    private dialogRef: MatDialogRef<OkrDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: SubTask[]
  ) {}

  ngOnInit(): void {}

  closeOkrDialog() {
    this.dialogRef.close();
  }
}
