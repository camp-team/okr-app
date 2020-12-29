import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HomeDetailComponent } from '../home-detail/home-detail.component';
import { OkrDetailComponent } from '../home-detail/okr-dialog/okr-detail/okr-detail.component';

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
    path: ':id',
    component: OkrDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
