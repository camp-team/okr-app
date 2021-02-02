import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Okr } from 'src/app/interfaces/okr';
import { SubTask } from 'src/app/interfaces/sub-task';
import { OkrService } from 'src/app/services/okr.service';
@Component({
  selector: 'app-okr-detail',
  templateUrl: './okr-detail.component.html',
  styleUrls: ['./okr-detail.component.scss'],
})
export class OkrDetailComponent implements OnInit {
  private okrId = this.route.snapshot.queryParamMap.get('okrId');
  private primaryId = this.route.snapshot.queryParamMap.get('primaryId');
  private subTaskId = this.route.snapshot.queryParamMap.get('subTaskId');

  okr$: Observable<Okr> = this.okrService.getOkr(this.okrId);
  subTask$: Observable<SubTask> = this.okrService.getSubTask(
    this.okrId,
    this.primaryId,
    this.subTaskId
  );

  constructor(public okrService: OkrService, private route: ActivatedRoute) {}

  ngOnInit() {}
}
