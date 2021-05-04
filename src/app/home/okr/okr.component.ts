import { Component, OnInit, Input } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Okr } from 'src/app/interfaces/okr';
import { Primary } from 'src/app/interfaces/primary';
import { OkrDeleteDialogComponent } from 'src/app/okr-delete-dialog/okr-delete-dialog.component';
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
  obj: FormGroup;
  key: FormGroup;
  primaries$: Observable<Primary[]>;

  constructor(
    private okrService: OkrService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.primaries$ = this.okrService.getPrimaries(this.okr.okrId);
    this.objective();
    this.keyResult();
  }

  get objectiveContoroll() {
    return this.obj.get('objective') as FormControl;
  }

  objective() {
    console.log('fafa');

    this.obj = this.fb.group({
      objective: [
        this.okr.title,
        [Validators.required, Validators.maxLength(20)],
      ],
    });
    this.obj.valueChanges.pipe(debounceTime(500)).subscribe((obj) => {
      this.updateObjective(obj.objective);
    });
  }

  keyResult() {
    this.okrService.getPrimaries(this.okr.okrId).subscribe((primaries) => {
      primaries.forEach((primary) => {
        this.keyResults[primary.primaryId] = this.fb.array([]);
        this.key = this.fb.group({
          key: [
            primary.primaryTitle,
            [Validators.required, Validators.maxLength(20)],
          ],
        });
        this.keyResults[primary.primaryId].push(this.key);
        this.key.valueChanges
          .pipe(debounceTime(500))
          .subscribe((primaryTitle) => {
            this.updateKeyResult(primary.primaryId, primaryTitle.key);
          });
      });
    });
  }

  updateObjective(objective) {
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
    const okrValue: Omit<
      Okr,
      | 'okrId'
      | 'primaries'
      | 'start'
      | 'end'
      | 'creatorId'
      | 'title'
      | 'isComplete'
    > = {
      isComplete: false,
    };
    this.okrService.updateOkr(this.authService.uid, okrId, okrValue);
    this.snackBar.open('お疲れ様でした✨');
  }

  deleteOkr() {
    this.dialog.open(OkrDeleteDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      data: {
        okrId: this.okr.okrId,
      },
    });
  }
}
