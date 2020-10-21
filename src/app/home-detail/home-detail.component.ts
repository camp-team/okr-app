import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Okr } from '../interfaces/okr';
import { OkrService } from '../services/okr.service';
import { Observable } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OkrDialogComponent } from './okr-dialog/okr-dialog.component';
import { AuthService } from '../services/auth.service';
import { SubTask } from '../interfaces/sub-task';
import { Primary } from '../interfaces/primary';

@Component({
  selector: 'app-home-detail',
  templateUrl: './home-detail.component.html',
  styleUrls: ['./home-detail.component.scss'],
})
export class HomeDetailComponent implements OnInit {
  test = [];
  private okrId = this.route.snapshot.queryParamMap.get('v');
  private uid = this.authService.uid;
  okr$: Observable<Okr> = this.okrService.getOkr(this.okrId);
  primaries$: Observable<Primary[]> = this.okrService.getPrimaries(this.okrId);
  subTasks$: Observable<SubTask[]> = this.okrService.getSubTasksCollection(
    this.okrId
  );
  okr: Okr;
  form: FormGroup = this.fb.group({
    key: ['', [Validators.required]],
    terget: ['', [Validators.required]],
    current: ['', [Validators.required]],
    percentage: ['', [Validators.required]],
    LastUpdated: ['', [Validators.required]],
  });

  primaries: Primary[] = [];
  subTask = [];

  addRow(primaryIndex: number) {
    this.subTask[primaryIndex].push(this.form);
  }
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
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.primaries$.subscribe((primaries) => {
      primaries.forEach((primary) => {
        this.primaries.push(primary);
        this.subTask.push(this.fb.array([]));
      });
    });
    this.primaries$.subscribe((primaries) => {
      primaries.forEach((primary) => {
        this.test.push(primary.id);
      });
    });
    this.subTasks$.subscribe((subTasks) => {
      this.form.patchValue({ ...subTasks });
    });
  }

  remove(primaryIndex: number, formIndex: number) {
    this.subTask[primaryIndex].removeAt(formIndex);
  }

  createCellData(primaryId: string) {
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

  openOkrDialog(primaryIndex: number) {
    this.dialog.open(OkrDialogComponent, {
      width: '640px',
      data: {
        primaries: this.primaries[primaryIndex],
        subTask: this.subTask[primaryIndex],
      },
    });
  }
}
