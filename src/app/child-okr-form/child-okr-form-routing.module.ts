import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChildOkrFormComponent } from './child-okr-form/child-okr-form.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ChildOkrFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChildOkrFormRoutingModule {}
