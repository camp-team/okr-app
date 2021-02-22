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
          import('../edit/edit.module').then((m) => m.EditModule),
      },
      {
        path: 'home',
        loadChildren: () =>
          import('../home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'okr-edit',
        loadChildren: () =>
          import('../okr-edit/okr-edit.module').then((m) => m.OkrEditModule),
      },
      {
        path: 'achieve',
        loadChildren: () =>
          import('../okr-achievement/okr-achievement.module').then(
            (m) => m.OkrAchievementModule
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
