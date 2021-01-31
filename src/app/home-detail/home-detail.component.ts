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
import { OkrDeleteDialogComponent } from '../okr-delete-dialog/okr-delete-dialog.component';
import { Okr } from '../interfaces/okr';
import { firestore } from 'firebase';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home-detail',
  templateUrl: './home-detail.component.html',
  styleUrls: ['./home-detail.component.scss'],
  providers: [DatePipe],
})
export class HomeDetailComponent implements OnInit {
  private okrId = this.route.snapshot.queryParamMap.get('v');
  private primaryTitle: FormGroup;
  private row: FormGroup;
  public primaryTitles: {
    [keyName: string]: FormArray;
  } = {};
  public rows: {
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
  okr$: Observable<Okr> = this.okrService.getOkr(this.okrId);

  constructor(
    private route: ActivatedRoute,
    public okrService: OkrService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService,
    private datepipe: DatePipe
  ) {}

  ngOnInit() {
    combineLatest([this.primaries$, this.subTasks$])
      .pipe(take(1))
      .subscribe(([primaries, subTasks]) => {
        primaries.forEach((primary) => {
          this.primaries.push(primary);
          this.rows[primary.id] = this.fb.array([]);
          this.primaryTitles[primary.id] = this.fb.array([]);
          this.initPrimary(primary.id, primary.primaryTitle);
        });
        subTasks.forEach((subTask) => {
          this.initRows(
            subTask.primaryId,
            subTask.id,
            subTask.key,
            subTask.target,
            subTask.current,
            subTask.lastUpdated,
            subTask.percentage
          );
        });
      });
  }

  initPrimary(primaryId: string, primary: string) {
    this.primaryTitle = this.fb.group({
      primaryTitle: [primary, [Validators.required]],
    });
    this.primaryTitles[primaryId].push(this.primaryTitle);
  }

  initRows(
    primaryId: string,
    subTaskId: string,
    key: string,
    target: number,
    current: number,
    lastUpdated: firestore.Timestamp,
    percentage: string
  ) {
    const timeStamp = lastUpdated.toDate();
    const date = this.datepipe.transform(timeStamp, 'yyyy/MM/dd');
    this.row = this.fb.group({
      key: [key, [Validators.required]],
      target: [target, [Validators.required]],
      current: [current, [Validators.required]],
      percentage: [percentage, [Validators.required]],
      lastUpdated: [date, [Validators.required]],
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
    const subTaskValue: Omit<SubTask, 'id' | 'lastUpdated'> = {
      okrId: this.okrId,
      primaryId,
      key: formData.key,
      target: formData.target,
      current: formData.current,
      percentage: formData.percentage,
    };
    this.okrService.createSubTask(subTaskValue, primaryId, this.okrId);
  }

  remove(primaryId: string, rowIndex: number) {
    this.rows[primaryId].removeAt(rowIndex);
  }

  updatePrimaryTitle(primaryId: string, primaryTitle: Primary) {
    this.okrService.updatePrimaryTitle(
      this.authService.uid,
      this.okrId,
      primaryId,
      primaryTitle
    );
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
      const primaryValue: Omit<Primary, 'primaryTitle'> = {
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
    const formData = row;
    const subTaskValue: Omit<SubTask, 'lastUpdated'> = {
      okrId: this.okrId,
      primaryId,
      id: subTaskId,
      key: formData.key,
      target: formData.target,
      current: formData.current,
      percentage: result + '%',
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

  okrDeleteDialog(okrId: Okr) {
    this.dialog.open(OkrDeleteDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      data: {
        id: okrId,
      },
    });
  }
}
