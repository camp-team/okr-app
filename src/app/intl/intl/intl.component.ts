import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ManageService } from 'src/app/manage/manage/manage.service';
@Component({
  selector: 'app-intl',
  templateUrl: './intl.component.html',
  styleUrls: ['./intl.component.scss'],
})
export class IntlComponent implements OnInit {
  opened$: Observable<boolean> = this.manageService.isOpen$;

  constructor(private manageService: ManageService) {}

  ngOnInit(): void {}
}
