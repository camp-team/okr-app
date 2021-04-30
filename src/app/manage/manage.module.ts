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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ManageFooterComponent } from '../manage-footer/manage-footer.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CompleteOkrComponent } from '../complete-okr/complete-okr.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CompleteOkrTitleComponent } from '../complete-okr-title/complete-okr-title.component';

@NgModule({
  declarations: [
    ManageComponent,
    ManageHeaderComponent,
    ManageFooterComponent,
    CompleteOkrComponent,
    CompleteOkrTitleComponent,
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
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
  ],
})
export class ManageModule {}
