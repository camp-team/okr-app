import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { OkrService } from 'src/app/services/okr.service';

@Component({
  selector: 'app-okr-dialog',
  templateUrl: './okr-dialog.component.html',
  styleUrls: ['./okr-dialog.component.scss'],
})
export class OkrDialogComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private okrSearvice: OkrService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      primaries;
      tableData;
    }
  ) {
    this.route.queryParamMap.pipe(
      switchMap((params) => {
        return this.okrSearvice.getPrimaries(params.get('id'));
      })
    );
  }

  ngOnInit(): void {}
}
