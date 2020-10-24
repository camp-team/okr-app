import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Okr } from '../interfaces/okr';
import { OkrService } from '../services/okr.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OkrDialogComponent } from './okr-dialog/okr-dialog.component';
import { SubTask } from '../interfaces/sub-task';
import { Primary } from '../interfaces/primary';

@Component({
  selector: 'app-home-detail',
  templateUrl: './home-detail.component.html',
  styleUrls: ['./home-detail.component.scss'],
})
export class HomeDetailComponent implements OnInit {
  private okrId = this.route.snapshot.queryParamMap.get('v');

  rowArrays = [];
  primaryIdArray = [];
  primaryArray: Primary[] = [];

  okr$: Observable<Okr> = this.okrService.getOkr(this.okrId);
  primaries$: Observable<Primary[]> = this.okrService.getPrimaries(this.okrId);
  subTasks$: Observable<SubTask[]> = this.okrService.getSubTasksCollection(
    this.okrId
  );

  form = this.fb.group({
    Key: ['', [Validators.required]],
    Terget: ['', [Validators.required]],
    Current: ['', [Validators.required]],
    Percentage: ['', [Validators.required]],
    LastUpdated: ['', [Validators.required]],
  });

  get key(): FormControl {
    return this.form.get('key') as FormControl;
  }
  get terget(): FormControl {
    return this.form.get('terget') as FormControl;
  }
  get current(): FormControl {
    return this.form.get('current') as FormControl;
  }
  get percentage(): FormControl {
    return this.form.get('percentage') as FormControl;
  }
  get LastUpdated(): FormControl {
    return this.form.get('LastUpdated') as FormControl;
  }

  constructor(
    private route: ActivatedRoute,
    public okrService: OkrService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.primaries$.subscribe((primaries) => {
      primaries.forEach((primary) => {
        this.primaryArray.push(primary);
        this.rowArrays.push(this.fb.array([]));
      });
    });
    this.primaries$.subscribe((primaries) => {
      primaries.forEach((primary) => {
        this.primaryIdArray.push(primary.id);
      });
    });
    this.subTasks$.subscribe((subTasks) => {
      this.form.patchValue({ ...subTasks });
    });
  }

  addRow(primaryArrayIndex: number) {
    this.rowArrays[primaryArrayIndex].push(this.form);
  }

  remove(primaryArrayIndex: number, rowIndex: number) {
    this.rowArrays[primaryArrayIndex].removeAt(rowIndex);
  }

  subTaskData(primaryId: string) {
    const formData = this.form.value;
    const subTaskValue: Omit<SubTask, 'id'> = {
      okrId: this.okrId,
      key: formData.key,
      terget: formData.terget,
      current: formData.current,
      percentage: formData.percentage,
      LastUpdated: formData.LastUpdated,
    };
    this.okrService.createSubTask(subTaskValue, primaryId, this.okrId);
  }

  openOkrDialog(primaryArrayIndex: number) {
    this.dialog.open(OkrDialogComponent, {
      width: '640px',
      data: {
        primaryArray: this.primaryArray[primaryArrayIndex],
        rowArrays: this.rowArrays[primaryArrayIndex],
      },
    });
  }
}
