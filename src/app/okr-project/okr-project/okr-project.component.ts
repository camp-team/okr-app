import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ParentOkr } from 'src/app/interfaces/parent-okr';
import { OkrService } from 'src/app/services/okr.service';

@Component({
  selector: 'app-okr-project',
  templateUrl: './okr-project.component.html',
  styleUrls: ['./okr-project.component.scss'],
})
export class OkrProjectComponent implements OnInit {
  private parentOkrId = this.route.snapshot.queryParamMap.get('id');
  parentOkr$: Observable<ParentOkr> = this.okrService.getParentOkr(
    this.parentOkrId
  );

  constructor(public okrService: OkrService, private route: ActivatedRoute) {}

  ngOnInit(): void {}
}
