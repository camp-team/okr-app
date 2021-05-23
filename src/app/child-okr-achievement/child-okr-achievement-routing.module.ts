import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OkrAchievementComponent } from './child-okr-achievement/child-okr-achievement.component';

const routes: Routes = [
  {
    path: '',
    component: OkrAchievementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OkrAchievementRoutingModule {}
