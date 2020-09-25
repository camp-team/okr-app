import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Okr } from '../interfaces/okr';
import { OkrService } from '../services/okr.service';
import { Observable } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home-detail',
  templateUrl: './home-detail.component.html',
  styleUrls: ['./home-detail.component.scss'],
})
export class HomeDetailComponent implements OnInit {
  private okrId = this.route.snapshot.paramMap.get('id');

  okr$: Observable<Okr> = this.okrService.getOkr(this.okrId);
  okr: Okr;

  tableBody = [];
  tableForm = [];

  constructor(
    private route: ActivatedRoute,
    public okrService: OkrService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.okr$.subscribe((item) => {
      item.primaries.forEach((primary) => {
        this.tableBody.push(primary);
        this.tableForm.push(this.fb.array([]));
        console.log(this.tableBody);
        console.log(this.tableForm);
      });
    });
  }

  addRow(primaryIndex: number) {
    const row = this.fb.group({
      title: ['', [Validators.required]],
      target: ['', [Validators.required]],
      current: ['', [Validators.required]],
      percentage: ['', [Validators.required]],
      lastUpdated: ['', [Validators.required]],
    });
    this.tableForm[primaryIndex].push(row);
  }

  removeRow(primaryIndex: number) {
    this.tableForm[primaryIndex].removeAt();
  }
}
