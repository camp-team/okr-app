import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChildOkrComponent } from './child-okr/child-okr.component';

const routes: Routes = [
  {
    path: '',
    component: ChildOkrComponent,
  },
  {
    path: ':childOkrId',
    component: ChildOkrComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChildOkrRoutingModule {}
