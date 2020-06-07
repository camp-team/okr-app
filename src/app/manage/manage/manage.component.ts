import { Component, OnInit } from '@angular/core';
import { ManageService } from './manage.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
})
export class ManageComponent implements OnInit {
  opened: boolean;

  constructor(private manageService: ManageService) {
    this.manageService.toggle(),
      this.manageService.isOpen$.subscribe((opened) => (this.opened = opened));
  }

  ngOnInit(): void {}
}
