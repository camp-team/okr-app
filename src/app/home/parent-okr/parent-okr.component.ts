import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { ParentOkr } from 'src/app/interfaces/parent-okr';
import { ParentOkrKeyResult } from 'src/app/interfaces/parent-okr-key-result';
import { AuthService } from 'src/app/services/auth.service';
import { OkrService } from 'src/app/services/okr.service';

@Component({
  selector: 'app-parent-okr',
  templateUrl: './parent-okr.component.html',
  styleUrls: ['./parent-okr.component.scss'],
})
export class ParentOkrComponent implements OnInit {
  @Input() parentOkr: ParentOkr;
  keyResults: {
    [parentOkrKeyResultId: string]: FormArray;
  } = {};
  objectives: {
    [parentOkrId: string]: FormArray;
  } = {};
  obj: FormGroup;
  key: FormGroup;
  parentOkrKeyResults: ParentOkrKeyResult[] = [];
  parentOkrs: ParentOkr[] = [];

  constructor(
    private okrService: OkrService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.okrService.getParentOkrKeyResults(this.parentOkr.parentOkrId),
      this.okrService.parentOkrs$,
    ])
      .pipe(take(1))
      .subscribe(([parentOkrKeyResults, parentOkrs]) => {
        parentOkrKeyResults.forEach(
          (parentOkrKeyResult: ParentOkrKeyResult) => {
            this.parentOkrKeyResults.push(parentOkrKeyResult);
            this.keyResults[
              parentOkrKeyResult.parentOkrKeyResultId
            ] = this.fb.array([]);
            this.initKeyResult(parentOkrKeyResult);
          }
        );
        parentOkrs.forEach((parentOkr: ParentOkr) => {
          this.parentOkrs.push(parentOkr);
          this.objectives[parentOkr.parentOkrId] = this.fb.array([]);
          this.initObjective(parentOkr);
        });
      });
  }

  initObjective(parentOkr: ParentOkr) {
    this.obj = this.fb.group({
      objective: [
        parentOkr.parentOkrObjective,
        [Validators.required, Validators.maxLength(20)],
      ],
    });
    this.objectives[parentOkr.parentOkrId].push(this.obj);
    this.obj.valueChanges
      .pipe(debounceTime(500))
      .subscribe((parentOkrObjectivesForm) => {
        this.updateObjective(parentOkrObjectivesForm.objective);
      });
  }

  initKeyResult(parentOkrKeyResult: ParentOkrKeyResult) {
    this.key = this.fb.group({
      key: [
        parentOkrKeyResult.parentOkrKeyResult,
        [Validators.required, Validators.maxLength(20)],
      ],
    });
    this.keyResults[parentOkrKeyResult.parentOkrKeyResultId].push(this.key);

    this.key.valueChanges
      .pipe(debounceTime(500))
      .subscribe((parentOkrKeyResultsForm) => {
        this.updateParentOkrKeyResult(
          parentOkrKeyResult.parentOkrKeyResultId,
          parentOkrKeyResultsForm.key
        );
      });
  }

  updateObjective(parentOkrObjective: ParentOkr) {
    this.okrService.updateParentOkr(
      this.authService.uid,
      this.parentOkr.parentOkrId,
      parentOkrObjective
    );
  }

  updateParentOkrKeyResult(
    parentOkrKeyResultId: string,
    parentOkrKeyResult: ParentOkrKeyResult
  ) {
    this.okrService.updateParentOkrKeyResult(
      this.authService.uid,
      this.parentOkr.parentOkrId,
      parentOkrKeyResultId,
      parentOkrKeyResult
    );
  }

  okrComplete(okrId: string) {
    const okrValue: ParentOkr = {
      isParentOkrComplete: false,
    };
    this.okrService.updateParentOkr(this.authService.uid, okrId, okrValue);
    this.snackBar.open('お疲れ様でした✨');
  }
}
