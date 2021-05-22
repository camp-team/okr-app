import { Component, OnInit, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  parentOkrKeyResults: ParentOkrKeyResult[] = [];
  parentOkrKeyResultsForm: {
    [parentOkrKeyResultId: string]: FormArray;
  } = {};
  parentOkrkeyResultForm: FormGroup;
  parentOkrObjectiveForm: FormGroup;

  constructor(
    private okrService: OkrService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.okrService
      .getParentOkrKeyResults(this.parentOkr.parentOkrId)
      .pipe(take(1))
      .subscribe((parentOkrKeyResults) => {
        parentOkrKeyResults.forEach(
          (parentOkrKeyResult: ParentOkrKeyResult) => {
            this.parentOkrKeyResults.push(parentOkrKeyResult);
            this.parentOkrKeyResultsForm[
              parentOkrKeyResult.parentOkrKeyResultId
            ] = this.fb.array([]);
            this.initFormParentOkrKeyResult(parentOkrKeyResult);
          }
        );
        this.parentOkrObjectiveForm = this.fb.group({
          objective: [
            this.parentOkr.parentOkrObjective,
            [Validators.required, Validators.maxLength(20)],
          ],
        });
        this.updateParentOkrObjective();
      });
  }

  get objective(): FormControl {
    return this.parentOkrObjectiveForm.get('objective') as FormControl;
  }

  updateParentOkrObjective() {
    this.parentOkrObjectiveForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe((parentOkrObjectivesForm: { objective: ParentOkr }) => {
        this.okrService.updateParentOkrObjective({
          uid: this.authService.uid,
          parentOkrId: this.parentOkr.parentOkrId,
          parentOkrObjective: parentOkrObjectivesForm.objective,
        });
      });
  }

  initFormParentOkrKeyResult(parentOkrKeyResult: ParentOkrKeyResult) {
    this.parentOkrkeyResultForm = this.fb.group({
      key: [
        parentOkrKeyResult.parentOkrKeyResult,
        [Validators.required, Validators.maxLength(20)],
      ],
    });
    this.parentOkrKeyResultsForm[parentOkrKeyResult.parentOkrKeyResultId].push(
      this.parentOkrkeyResultForm
    );
    this.parentOkrkeyResultForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe((parentOkrKeyResultsForm) => {
        this.updateParentOkrKeyResult(
          parentOkrKeyResult.parentOkrKeyResultId,
          parentOkrKeyResultsForm.key
        );
      });
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
}
