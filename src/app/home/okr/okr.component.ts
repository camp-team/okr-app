import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  primariess$: Observable<Primary[]>;

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
    this.primaries$ = this.okrService.getPrimaries(this.okr.id);
    this.objective();
    this.keyResultfa();
  }

  objective() {
    this.form = this.fb.group({
      Objective: [this.okr.title, [Validators.required]],
      categories: this.fb.array([]),
    });
  }

  keyResultfa() {
    this.okrService.getPrimaries(this.okr.id).subscribe((primaries) => {
      primaries.forEach((primary) => {
        this.keyResults[primary.id] = this.fb.array([]);
        this.keyResult = this.fb.group({
          key: [primary.primaryTitle, [Validators.required]],
        });
        this.keyResults[primary.id].push(this.keyResult);
      });
    });
  }

  updateObjective(objective) {
    console.log(objective);
    this.okrService.updateOkr(this.authService.uid, this.okr.id, objective);
  }

  updateKeyResult(keyResultId, keyResultTitle: Primary) {
    this.okrService.updatePrimary(
      this.authService.uid,
      this.okr.id,
      keyResultId,
      keyResultTitle[0].key
    );
  }

  okrComplete(okrId: string) {
    const okrValue: Omit<
      Okr,
      | 'id'
      | 'primaries'
      | 'start'
      | 'end'
      | 'CreatorId'
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
        okrId: this.okr.id,
      },
    });
  }
}
