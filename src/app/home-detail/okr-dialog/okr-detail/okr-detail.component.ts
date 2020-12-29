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
  subTask$: Observable<SubTask>;

  readonly lists = [
    {
      menu: 'target',
      text: 'テスト',
    },
    {
      menu: 'current',
      text: 'テスト',
    },
    {
      menu: 'percentage',
      text: 'テスト',
    },
    {
      menu: 'lastUpdated',
      text: 'テスト',
    },
  ];

  constructor(public okrService: OkrService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      const okrId = params.get('okrId');
      const primaryId = params.get('primaryId');
      const subTaskId = params.get('subTaskId');
      this.subTask$ = this.okrService.getSubTask(okrId, primaryId, subTaskId);
    });
  }
}
