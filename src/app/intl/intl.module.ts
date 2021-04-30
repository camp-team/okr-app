import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntlRoutingModule } from './intl-routing.module';
import { IntlComponent } from './intl/intl.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { IntlHeaderComponent } from '../intl-header/intl-header.component';
@NgModule({
  declarations: [IntlComponent, IntlHeaderComponent],
  imports: [
    CommonModule,
    IntlRoutingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatListModule,
  ],
})
export class IntlModule {}
