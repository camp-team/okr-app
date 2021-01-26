import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OkrService } from '../services/okr.service';
import { combineLatest, Observable } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OkrDialogComponent } from './okr-dialog/okr-dialog.component';
import { SubTask } from '../interfaces/sub-task';
import { Primary } from '../interfaces/primary';
import { AuthService } from '../services/auth.service';
import { switchMap, take } from 'rxjs/operators';
@Component({
  selector: 'app-home-detail',
  templateUrl: './home-detail.component.html',
  styleUrls: ['./home-detail.component.scss'],
})
export class HomeDetailComponent implements OnInit {
  private okrId = this.route.snapshot.queryParamMap.get('v');

  rows: {
    [keyName: string]: FormArray;
  } = {};
  primaryIdArray = [];
  primaries: Primary[] = [];

  primaries$: Observable<Primary[]> = this.authService.user$.pipe(
    switchMap((user) => {
      return this.okrService.getPrimaries(this.okrId);
    })
  );
  subTasks$: Observable<SubTask[]> = this.okrService.getSubTasksCollection(
    this.okrId
  );
  row: FormGroup;

  constructor(
    private route: ActivatedRoute,
    public okrService: OkrService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    combineLatest([this.primaries$, this.subTasks$])
      .pipe(take(1))
      .subscribe(([primaries, subTasks]) => {
        primaries.forEach((primary) => {
          this.primaries.push(primary);
          this.rows[primary.id] = this.fb.array([]);
        });
        subTasks.forEach((subTask) => {
          this.initRows(
            subTask.primaryId,
            subTask.id,
            subTask.key,
            subTask.target,
            subTask.current,
            subTask.percentage
          );
        });
      });
  }

  initRows(
    primaryId: string,
    subTaskId: string,
    key: string,
    target: number,
    current: number,
    percentage: string
  ) {
    this.row = this.fb.group({
      key: [key, [Validators.required]],
      target: [target, [Validators.required]],
      current: [current, [Validators.required]],
      percentage: [percentage, [Validators.required]],
      lastUpdated: ['', [Validators.required]],
      subTaskId,
    });
    this.rows[primaryId].push(this.row);
  }

  addRow(primaryId: string) {
    this.row = this.fb.group({
      key: ['', [Validators.required]],
      target: ['', [Validators.required]],
      current: ['', [Validators.required]],
      percentage: ['', [Validators.required]],
      lastUpdated: ['', [Validators.required]],
    });
    this.rows[primaryId].push(this.row);
    const formData = this.row.value;
    const subTaskValue: Omit<SubTask, 'id'> = {
      okrId: this.okrId,
      primaryId,
      key: formData.key,
      target: formData.target,
      current: formData.current,
      percentage: formData.percentage,
      lastUpdated: formData.lastUpdated,
    };
    this.okrService.createSubTask(subTaskValue, primaryId, this.okrId);
  }

  remove(primaryId: string, rowIndex: number) {
    this.rows[primaryId].removeAt(rowIndex);
  }

  updateSubTaskData(primaryId: string, subTaskId: string, row: SubTask) {
    this.subTasks$.subscribe((subTasks) => {
      let average = 0;
      const subTaskPercentage = subTasks.filter((subTask) => {
        if (subTask.primaryId === primaryId) {
          return subTask.percentage;
        }
      });
      for (let i = 0; i < subTaskPercentage.length; i++) {
        const subTaskPercentageNumber = subTaskPercentage[i].percentage.slice(
          0,
          -1
        );
        average = average + +subTaskPercentageNumber;
      }
      const primaryValue: Omit<Primary, 'titles'> = {
        id: primaryId,
        average: average,
      };

      this.okrService.updatePrimary(
        this.authService.uid,
        this.okrId,
        primaryId,
        primaryValue
      );
    });

    const target = row.target;
    const current = row.current;
    const percentage = (current / target) * 100;
    const result = Math.round(percentage * 10) / 10;
    const subTaskValue: Omit<SubTask, 'id'> = {
      okrId: this.okrId,
      primaryId,
      key: row.key,
      target: row.target,
      current: row.current,
      percentage: result + '%',
      lastUpdated: row.lastUpdated,
    };
    this.okrService.updateSubTask(
      this.authService.uid,
      this.okrId,
      primaryId,
      subTaskId,
      subTaskValue
    );
  }

  openOkrDialog(subtaskId: string) {
    this.subTasks$.subscribe((subTasks) => {
      const resultSubTasks: SubTask[] = subTasks.filter((subTask) => {
        return subTask.id === subtaskId;
      });
      this.dialog.open(OkrDialogComponent, {
        width: '640px',
        data: [
          {
            okrId: resultSubTasks.map((subTask) => {
              return subTask.okrId;
            }),
            primaryId: resultSubTasks.map((subTask) => {
              return subTask.primaryId;
            }),
            id: resultSubTasks.map((subTask) => {
              return subTask.id;
            }),
            key: resultSubTasks.map((subTask) => {
              return subTask.key;
            }),
            target: resultSubTasks.map((subTask) => {
              return subTask.target;
            }),
            current: resultSubTasks.map((subTask) => {
              return subTask.current;
            }),
            percentage: resultSubTasks.map((subTask) => {
              return subTask.percentage;
            }),
            lastUpdated: resultSubTasks.map((subTask) => {
              return subTask.lastUpdated;
            }),
          },
        ],
      });
    });
  }
}
