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

@Component({
  selector: 'app-home-detail',
  templateUrl: './home-detail.component.html',
  styleUrls: ['./home-detail.component.scss'],
})
export class HomeDetailComponent implements OnInit {
  private uid = this.authService.uid;
  private okrId = this.route.snapshot.paramMap.get('id');
  private primaryId: any = this.okrService.getPrimaries(this.okrId);

  okr$: Observable<Okr> = this.okrService.getOkr(this.okrId);
  okr: Okr;
  row: FormGroup;

  tableTitle = [];
  tableData = [];

  constructor(
    private route: ActivatedRoute,
    public okrService: OkrService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.okr$.subscribe((okr) => {
      okr.primaries.forEach((primary) => {
        this.tableTitle.push(primary);
        this.tableData.push(this.fb.array([]));
      });
    });
  }

  addRow(primaryIndex: number) {
    this.row = this.fb.group({
      key: ['', [Validators.required]],
      target: ['', [Validators.required]],
      current: ['', [Validators.required]],
      percentage: ['', [Validators.required]],
      lastUpdated: ['', [Validators.required]],
    });
    this.tableData[primaryIndex].push(this.row);
  }
  get key(): FormControl {
    return this.row.get('key') as FormControl;
  }
  get target(): FormControl {
    return this.row.get('target') as FormControl;
  }
  get current(): FormControl {
    return this.row.get('current') as FormControl;
  }
  get percentage(): FormControl {
    return this.row.get('percentage') as FormControl;
  }
  get lastUpdated(): FormControl {
    return this.row.get('lastUpdated') as FormControl;
  }

  remove(primaryIndex: number, rowIndex: number) {
    this.tableData[primaryIndex].removeAt(rowIndex);
  }

  updateCellData() {}

  createCellData(primaryIndex: number) {}

  openOkrDialog(primaryIndex: number) {
    const formData = this.row.value;
    const subTaskValue: Omit<SubTask, 'id'> = {
      key: formData.string,
      terget: formData.number,
      current: formData.number,
      percentage: formData.number,
      lastupdated: formData.data,
    };
    this.okrService.createSubTask(subTaskValue, this.primaryId, this.okrId);
    this.dialog.open(OkrDialogComponent, {
      width: '640px',
      data: {
        tableTitle: this.tableTitle[primaryIndex],
        tableData: this.tableData[primaryIndex],
      },
    });
  }
}
