import { Component, OnInit } from '@angular/core';
import { ManageService } from '../manage/manage/manage.service';

@Component({
  selector: 'app-intl-header',
  templateUrl: './intl-header.component.html',
  styleUrls: ['./intl-header.component.scss'],
})
export class IntlHeaderComponent implements OnInit {
  constructor(private manageService: ManageService) {}

  ngOnInit(): void {}

  toggle() {
    this.manageService.toggle();
  }
}
