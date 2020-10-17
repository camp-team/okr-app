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
  private okrId = this.route.snapshot.queryParamMap.get('v');

  okr$: Observable<Okr> = this.okrService.getOkr(this.okrId);
  okr: Okr;
  row: FormGroup;

  primaries: Primary[] = [];
  tableData = [];

  addRow(primaryIndex: number) {
    this.row = this.fb.group({
      key: ['', [Validators.required]],
      terget: ['', [Validators.required]],
      current: ['', [Validators.required]],
      percentage: ['', [Validators.required]],
      LastUpdated: ['', [Validators.required]],
    });
    this.tableData[primaryIndex].push(this.row);
  }
  get key(): FormControl {
    return this.row.get('key') as FormControl;
  }
  get terget(): FormControl {
    return this.row.get('terget') as FormControl;
  }
  get current(): FormControl {
    return this.row.get('current') as FormControl;
  }
  get percentage(): FormControl {
    return this.row.get('percentage') as FormControl;
  }
  get LastUpdated(): FormControl {
    return this.row.get('LastUpdated') as FormControl;
  }

  constructor(
    private route: ActivatedRoute,
    public okrService: OkrService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const okrIds = this.okrService.getPrimaries(this.okrId);
    okrIds.subscribe((primaries) => {
      primaries.forEach((primary) => {
        this.primaries.push(primary);
        this.tableData.push(this.fb.array([]));
      });
    });
  }

  remove(primaryIndex: number, rowIndex: number) {
    this.tableData[primaryIndex].removeAt(rowIndex);
  }

  createCellData(primaryId: string) {
    const formData = this.row.value;
    const subTaskValue: Omit<SubTask, 'id'> = {
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
        tableData: this.tableData[primaryIndex],
      },
    });
  }
}
