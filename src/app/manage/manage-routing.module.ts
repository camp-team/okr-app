import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { EditComponent } from '../edit/edit/edit.component';
import { HomeComponent } from '../home/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: ManageComponent,
    children: [
      {
        path: 'edit',
        component: EditComponent,
      },
      {
        path: 'home',
        component: HomeComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageRoutingModule {}
