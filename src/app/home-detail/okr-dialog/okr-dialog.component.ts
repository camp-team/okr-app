import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubTask } from 'src/app/interfaces/sub-task';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-okr-dialog',
  templateUrl: './okr-dialog.component.html',
  styleUrls: ['./okr-dialog.component.scss'],
  providers: [DatePipe],
})
export class OkrDialogComponent implements OnInit {
  subTasks = this.data;
  private timeStamp = this.data[0].lastUpdated[0].toDate();
  private lastUpdate = this.datepipe.transform(this.timeStamp, 'yyyy/MM/dd');

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
      text: this.lastUpdate,
    },
  ];

  constructor(
    private dialogRef: MatDialogRef<OkrDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: SubTask[],
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {}

  closeOkrDialog() {
    this.dialogRef.close();
  }
}
