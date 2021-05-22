import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OkrProjectComponent } from './okr-project/okr-project.component';

const routes: Routes = [
  {
    path: '',
    component: OkrProjectComponent,
  },
  {
    path: 'projectId',
    component: OkrProjectComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OkrProjectRoutingModule {}
