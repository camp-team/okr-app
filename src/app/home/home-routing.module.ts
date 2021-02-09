import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HomeDetailComponent } from '../home-detail/home-detail.component';
import { OkrDetailComponent } from '../home-detail/okr-dialog/okr-detail/okr-detail.component';
import { SecondOkrComponent } from '../second-okr/second-okr.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'homedetail',
    component: HomeDetailComponent,
  },
  {
    path: 'secondokr',
    component: SecondOkrComponent,
  },
  {
    path: ':id',
    component: OkrDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
