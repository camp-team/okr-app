import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompletedChildOkrComponent } from '../completed-child-okr/completed-child-okr.component';
import { OkrAchievementComponent } from './okr-achievement/okr-achievement.component';

const routes: Routes = [
  {
    path: '',
    component: OkrAchievementComponent,
    children: [
      {
        path: ':secondOkrId',
        component: CompletedChildOkrComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OkrAchievementRoutingModule {}
