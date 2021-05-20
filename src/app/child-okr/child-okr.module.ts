import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecondOkrRoutingModule } from './child-okr-routing.module';
import { SecondOkrComponent } from './child-okr/child-okr.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SecondOkrTitleComponent } from '../second-okr-title/second-okr-title.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatButtonModule,
    MatTooltipModule,
  ],
})
export class SecondOkrModule {}
