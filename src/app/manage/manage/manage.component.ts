import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ManageService } from './manage.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
})
export class ManageComponent implements OnInit {
  opened$: Observable<boolean> = this.manageService.isOpen$;

  constructor(private manageService: ManageService) {}

  ngOnInit(): void {}
}
