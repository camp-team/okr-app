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
  primaries: Primary[] = [];

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
          this.primaries.push(primary);
          this.rows[primary.id] = this.fb.array([]);
        });
        subTasks.forEach((subTask) => {
          this.initRows(subTask.primaryId, subTask.id, subTask.key);
        });
      });
  }

  initRows(primaryId: string, subTaskId: string, value: string) {
    this.row = this.fb.group({
      key: [value, [Validators.required]],
      target: ['', [Validators.required]],
      current: ['', [Validators.required]],
      percentage: ['', [Validators.required]],
      lastUpdated: ['', [Validators.required]],
      subTaskId,
    });
    this.rows[primaryId].push(this.row);
  }

  addRow(primaryId: string, value: string = '') {
    this.row = this.fb.group({
      key: [value, [Validators.required]],
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
        primaries: this.primaries[index],
        rowArrays: this.rows[id],
      },
    });
  }
}
