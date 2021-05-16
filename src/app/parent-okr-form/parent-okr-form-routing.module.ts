import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParentOkrFormComponent } from './parent-okr-form/parent-okr-form.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ParentOkrFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParentOkrFormRoutingModule {}
