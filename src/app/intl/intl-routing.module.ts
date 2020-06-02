import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntlComponent } from './intl/intl.component';
import { TermsComponent } from '../terms/terms/terms.component';
import { LegalComponent } from '../legal/legal/legal.component';

const routes: Routes = [
  {
    path: '',
    component: IntlComponent,
    children: [
      {
        path: 'terms',
        component: TermsComponent,
      },
      {
        path: 'legal',
        component: LegalComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntlRoutingModule {}
