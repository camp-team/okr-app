import { Component, OnInit } from '@angular/core';
import { ManageService } from 'src/app/manage/manage/manage.service';
@Component({
  selector: 'app-intl',
  templateUrl: './intl.component.html',
  styleUrls: ['./intl.component.scss'],
})
export class IntlComponent implements OnInit {
  opened: boolean;

  constructor(private manageService: ManageService) {
    this.manageService.toggle(),
      this.manageService.isOpen$.subscribe((opened) => (this.opened = opened));
  }

  ngOnInit(): void {}
}
