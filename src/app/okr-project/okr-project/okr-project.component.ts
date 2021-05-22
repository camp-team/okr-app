import { Component, OnInit } from '@angular/core';
import { OkrService } from 'src/app/services/okr.service';

@Component({
  selector: 'app-okr-project',
  templateUrl: './okr-project.component.html',
  styleUrls: ['./okr-project.component.scss'],
})
export class OkrProjectComponent implements OnInit {
  constructor(public okrService: OkrService) {}

  ngOnInit(): void {}
}
