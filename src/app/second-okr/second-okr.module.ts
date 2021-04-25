import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecondOkrRoutingModule } from './second-okr-routing.module';
import { SecondOkrComponent } from './second-okr/second-okr.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SecondOkrTitleComponent } from '../second-okr-title/second-okr-title.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [SecondOkrComponent, SecondOkrTitleComponent],
  imports: [
    CommonModule,
    SecondOkrRoutingModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatMenuModule,
    MatButtonModule,
  ],
})
export class SecondOkrModule {}
