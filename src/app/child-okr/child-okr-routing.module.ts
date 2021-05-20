import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecondOkrComponent } from './child-okr/child-okr.component';

const routes: Routes = [
  {
    path: '',
    component: SecondOkrComponent,
  },
  {
    path: ':childOkrId',
    component: SecondOkrComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecondOkrRoutingModule {}
