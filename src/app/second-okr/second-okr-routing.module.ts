import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecondOkrComponent } from './second-okr/second-okr.component';

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
