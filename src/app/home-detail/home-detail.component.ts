import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Okr } from '../interfaces/okr';
import { OkrService } from '../services/okr.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OkrDialogComponent } from './okr-dialog/okr-dialog.component';

@Component({
  selector: 'app-home-detail',
  templateUrl: './home-detail.component.html',
  styleUrls: ['./home-detail.component.scss'],
})
export class HomeDetailComponent implements OnInit {
  private okrId = this.route.snapshot.paramMap.get('id');

  okr$: Observable<Okr> = this.okrService.getOkr(this.okrId);
  okr: Okr;
  row: FormGroup;

  tableTitle = [];
  tableData = [];

  constructor(
    private route: ActivatedRoute,
    public okrService: OkrService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.okr$.subscribe((item) => {
      item.primaries.forEach((primary) => {
        this.tableTitle.push(primary);
        this.tableData.push(this.fb.array([]));
      });
    });
  }

  addRow(primaryIndex: number) {
    this.row = this.fb.group({
      title: ['', [Validators.required]],
      target: ['', [Validators.required]],
      current: ['', [Validators.required]],
      percentage: ['', [Validators.required]],
      lastUpdated: ['', [Validators.required]],
    });
    this.tableData[primaryIndex].push(this.row);
  }

  remove(primaryIndex: number, rowIndex: number) {
    this.tableData[primaryIndex].removeAt(rowIndex);
  }

  openOkrDialog(primaryIndex: number) {
    this.dialog.open(OkrDialogComponent, {
      width: '640px',
      data: {
        tableTitle: this.tableTitle[primaryIndex],
        tableData: this.tableData[primaryIndex],
      },
    });
  }
}
