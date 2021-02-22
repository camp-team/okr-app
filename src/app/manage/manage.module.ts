import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageRoutingModule } from './manage-routing.module';
import { ManageComponent } from './manage/manage.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { ManageHeaderComponent } from '../manage-header/manage-header.component';
import { ManageSidenavigationComponent } from '../manage-sidenavigation/manage-sidenavigation.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ManageFooterComponent } from '../manage-footer/manage-footer.component';

@NgModule({
  declarations: [
    ManageComponent,
    ManageHeaderComponent,
    ManageSidenavigationComponent,
    ManageFooterComponent,
  ],
  imports: [
    CommonModule,
    ManageRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatMenuModule,
    MatProgressSpinnerModule,
  ],
})
export class ManageModule {}
