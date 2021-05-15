import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { Okr } from 'src/app/interfaces/okr';
import { Primary } from 'src/app/interfaces/primary';
import { AuthService } from 'src/app/services/auth.service';
import { OkrService } from 'src/app/services/okr.service';

@Component({
  selector: 'app-okr',
  templateUrl: './okr.component.html',
  styleUrls: ['./okr.component.scss'],
})
export class OkrComponent implements OnInit {
  @Input() okr: Okr;
  keyResults: {
    [primaryId: string]: FormArray;
  } = {};
  objectives: {
    [okrId: string]: FormArray;
  } = {};
  obj: FormGroup;
  key: FormGroup;
  primaries: Primary[] = [];
  okrs: Okr[] = [];
  okrs$: Observable<Okr[]> = this.okrService.getOkrs();

  constructor(
    private okrService: OkrService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    combineLatest([this.okrService.getPrimaries(this.okr.okrId), this.okrs$])
      .pipe(take(1))
      .subscribe(([primaries, okrs]) => {
        primaries.forEach((primary) => {
          this.primaries.push(primary);
          this.keyResults[primary.primaryId] = this.fb.array([]);
          this.initkeyResult(primary);
        });
        okrs.forEach((okr) => {
          this.okrs.push(okr);
          this.objectives[okr.okrId] = this.fb.array([]);
          this.initObjective(okr);
        });
      });
  }

  initObjective(okr) {
    this.obj = this.fb.group({
      objective: [okr.title, [Validators.required, Validators.maxLength(20)]],
    });
    this.objectives[okr.okrId].push(this.obj);
    this.obj.valueChanges.pipe(debounceTime(500)).subscribe((obj) => {
      this.updateObjective(obj.objective);
    });
  }

  initkeyResult(primary) {
    this.key = this.fb.group({
      key: [
        primary.primaryTitle,
        [Validators.required, Validators.maxLength(20)],
      ],
    });
    this.keyResults[primary.primaryId].push(this.key);
    this.key.valueChanges.pipe(debounceTime(500)).subscribe((primaryTitle) => {
      this.updateKeyResult(primary.primaryId, primaryTitle.key);
    });
  }

  updateObjective(objective: Okr) {
    this.okrService.updateOkr(this.authService.uid, this.okr.okrId, objective);
  }

  updateKeyResult(keyResultId: string, primaryTitle: Primary) {
    this.okrService.updatePrimary(
      this.authService.uid,
      this.okr.okrId,
      keyResultId,
      primaryTitle
    );
  }

  okrComplete(okrId: string) {
    const okrValue: Okr = {
      isComplete: false,
    };
    this.okrService.updateOkr(this.authService.uid, okrId, okrValue);
    this.snackBar.open('お疲れ様でした✨');
  }
}
