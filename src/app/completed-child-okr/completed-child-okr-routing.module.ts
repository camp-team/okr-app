import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompletedChildOkrComponent } from './completed-child-okr/completed-child-okr.component';

const routes: Routes = [
  {
    path: '',
    component: CompletedChildOkrComponent,
  },
  {
    path: ':childOkrId',
    component: CompletedChildOkrComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompletedChildOkrRoutingModule {}
