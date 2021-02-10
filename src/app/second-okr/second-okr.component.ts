import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SecondOkr } from '../interfaces/second-okr';
import { SecondOkrKeyResult } from '../interfaces/second-okr-key-result';
import { AuthService } from '../services/auth.service';
import { OkrService } from '../services/okr.service';

@Component({
  selector: 'app-second-okr',
  templateUrl: './second-okr.component.html',
  styleUrls: ['./second-okr.component.scss'],
})
export class SecondOkrComponent implements OnInit {
  private row: FormGroup;
  public rows: {
    [keyName: string]: FormArray;
  } = {};

  secondOkr$: Observable<SecondOkr[]> = this.okrService.getSecondOkrs();

  constructor(
    public okrService: OkrService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.secondOkr$.subscribe((secondOkr) => {
      secondOkr.forEach((secondOkr) => {
        secondOkr.id;
      });
    });
  }

  okrId() {
    this.secondOkr$.subscribe((secondOkr) => {
      secondOkr.forEach((secondOkr) => {
        secondOkr.id;
      });
    });
  }

  addRow(secondOkrId: string) {
    this.row = this.fb.group({
      key: ['', [Validators.required]],
      target: ['', [Validators.required]],
      current: ['', [Validators.required]],
      percentage: ['', [Validators.required]],
      lastUpdated: ['', [Validators.required]],
    });
    // this.rows[secondOkrId].push(this.row);
    const formData = this.row.value;
    const subTaskValue: Omit<SecondOkrKeyResult, 'id' | 'lastUpdated'> = {
      secondOkrId,
      key: formData.key,
      target: formData.target,
      current: formData.current,
      percentage: formData.percentage,
    };
    this.okrService.createSecondOkrKeyResult(subTaskValue, secondOkrId);
  }
}
