import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('./manage/manage.module').then((m) => m.ManageModule),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: 'intl',
    loadChildren: () => import('./intl/intl.module').then((m) => m.IntlModule),
  },
  {
    path: 'manage',
    loadChildren: () =>
      import('./manage/manage.module').then((m) => m.ManageModule),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: 'use-service',
    loadChildren: () =>
      import('./use-service/use-service.module').then(
        (m) => m.UseServiceModule
      ),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./about/about.module').then((m) => m.AboutModule),
    canLoad: [GuestGuard],
    canActivate: [GuestGuard],
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/settings.module').then((m) => m.SettingsModule),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
