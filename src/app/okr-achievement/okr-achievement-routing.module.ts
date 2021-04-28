import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompleteOkrComponent } from '../complete-okr/complete-okr.component';
import { OkrAchievementComponent } from './okr-achievement/okr-achievement.component';

const routes: Routes = [
  {
    path: '',
    component: OkrAchievementComponent,
    children: [
      {
        path: ':secondOkrId',
        component: CompleteOkrComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OkrAchievementRoutingModule {}
