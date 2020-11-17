import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Okr } from '../interfaces/okr';
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
  primaryArray: Primary[] = [];

  okr$: Observable<Okr> = this.okrService.getOkr(this.okrId);
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
          this.primaryArray.push(primary);
          this.rows[primary.id] = this.fb.array([]);
        });
        subTasks.forEach((subTask) => {
          this.initRows(subTask.primaryId, subTask.id, subTask.Key);
        });
      });
  }

  initRows(primaryId: string, subTaskId: string, value: string) {
    this.row = this.fb.group({
      Key: [value, [Validators.required]],
      Terget: ['', [Validators.required]],
      Current: ['', [Validators.required]],
      Percentage: ['', [Validators.required]],
      LastUpdated: ['', [Validators.required]],
      subTaskId,
    });
    this.rows[primaryId].push(this.row);
  }

  addRow(primaryId: string, value: string = '') {
    this.row = this.fb.group({
      Key: [value, [Validators.required]],
      Terget: ['', [Validators.required]],
      Current: ['', [Validators.required]],
      Percentage: ['', [Validators.required]],
      LastUpdated: ['', [Validators.required]],
    });
    this.rows[primaryId].push(this.row);
    const formData = this.row.value;
    const subTaskValue: Omit<SubTask, 'id'> = {
      okrId: this.okrId,
      primaryId,
      Key: formData.Key,
      Terget: formData.Terget,
      Current: formData.Current,
      Percentage: formData.Percentage,
      LastUpdated: formData.LastUpdated,
    };
    this.okrService.createSubTask(subTaskValue, primaryId, this.okrId);
  }

  remove(primaryId: string, rowIndex: number) {
    this.rows[primaryId].removeAt(rowIndex);
  }

  updateSubTaskData(primaryId: string, subTaskId: string, row: SubTask) {
    this.okrService.updateSubTask(
      this.authService.uid,
      this.okrId,
      primaryId,
      subTaskId,
      row
    );
  }

  openOkrDialog(id: string, index: number) {
    this.dialog.open(OkrDialogComponent, {
      width: '640px',
      data: {
        primaryArray: this.primaryArray[index],
        rowArrays: this.rows[id],
      },
    });
  }
}
