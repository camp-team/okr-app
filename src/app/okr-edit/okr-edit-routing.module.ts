import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OkrEditComponent } from './okr-edit/okr-edit.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: OkrEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OkrEditRoutingModule {}
