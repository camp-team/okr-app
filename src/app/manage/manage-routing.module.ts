import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageComponent } from './manage/manage.component';

const routes: Routes = [
  {
    path: '',
    component: ManageComponent,
    children: [
      {
        path: 'edit',
        loadChildren: () =>
          import('../parent-okr-form/parent-okr-form.module').then(
            (m) => m.ParentOkrFormModule
          ),
      },
      {
        path: 'home',
        loadChildren: () =>
          import('../home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'okr-edit',
        loadChildren: () =>
          import('../child-okr-form/child-okr-form.module').then(
            (m) => m.ChildOkrFormModule
          ),
      },
      {
        path: 'secondOkr',
        loadChildren: () =>
          import('../second-okr/second-okr.module').then(
            (m) => m.SecondOkrModule
          ),
      },
      {
        path: 'achieve',
        loadChildren: () =>
          import('../okr-achievement/okr-achievement.module').then(
            (m) => m.OkrAchievementModule
          ),
      },
      {
        path: 'complete',
        loadChildren: () =>
          import('../completed-child-okr/completed-child-okr.module').then(
            (m) => m.CompletedChildOkrModule
          ),
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageRoutingModule {}
