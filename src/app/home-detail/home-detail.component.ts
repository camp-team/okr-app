import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Okr } from '../interfaces/okr';
import { OkrService } from '../services/okr.service';
import { HomeComponent } from '../home/home/home.component';

@Component({
  selector: 'app-home-detail',
  templateUrl: './home-detail.component.html',
  styleUrls: ['./home-detail.component.scss'],
})
export class HomeDetailComponent implements OnInit {
  okrs = this.homeComponentTs.okrs$;
  okr;

  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore,
    public okrService: OkrService,
    private homeComponentTs: HomeComponent
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((map) => {
      const id = +map.get('id');
      this.okr = this.okrs[id - 1];
    });
  }
}
