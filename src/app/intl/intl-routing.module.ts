import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntlComponent } from './intl/intl.component';
import { TermsComponent } from '../terms/terms/terms.component';

const routes: Routes = [
  {
    path: '',
    component: IntlComponent,
    children: [
      {
        path: 'terms',
        component: TermsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntlRoutingModule {}
