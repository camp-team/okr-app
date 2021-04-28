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
  primaries$: Observable<Primary[]>;

  form: FormGroup;
  keyResult: FormGroup;
  keyResults: {
    [primaryId: string]: FormArray;
  } = {};

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
    this.keyResultfa();
  }

  objective() {
    this.form = this.fb.group({
      objective: [
        this.okr.title,
        [Validators.required, Validators.maxLength(20)],
      ],
      categories: this.fb.array([]),
    });
  }

  get objectiveContoroll() {
    return this.form.get('objective') as FormControl;
  }

  keyResultfa() {
    this.okrService.getPrimaries(this.okr.okrId).subscribe((primaries) => {
      primaries.forEach((primary) => {
        this.keyResults[primary.primaryId] = this.fb.array([]);
        this.keyResult = this.fb.group({
          key: [
            primary.primaryTitle,
            [Validators.required, Validators.maxLength(20)],
          ],
        });
        this.keyResults[primary.primaryId].push(this.keyResult);
      });
    });
  }

  updateObjective(objective) {
    this.okrService.updateOkr(this.authService.uid, this.okr.okrId, objective);
  }

  updateKeyResult(keyResultId: string, keyResultTitle: Primary) {
    this.okrService.updatePrimary(
      this.authService.uid,
      this.okr.okrId,
      keyResultId,
      keyResultTitle[0].key
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
    this.snackBar.open('お疲れ様でした✨', null);
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
