import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { SubTask } from 'src/app/interfaces/sub-task';
import { OkrService } from 'src/app/services/okr.service';
@Component({
  selector: 'app-okr-detail',
  templateUrl: './okr-detail.component.html',
  styleUrls: ['./okr-detail.component.scss'],
})
export class OkrDetailComponent implements OnInit {
  subTasks$: Observable<SubTask>;

  constructor(public okrService: OkrService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const okrId = params.get('okrId');
      const primaryId = params.get('primaryId');
      const subTaskId = params.get('subTaskId');
      this.subTasks$ = this.okrService.getSubTask(okrId, primaryId, subTaskId);
    });
  }
}
