import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChildOkrRoutingModule } from './child-okr-routing.module';
import { ChildOkrComponent } from './child-okr/child-okr.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChildOkrTitleComponent } from '../child-okr-title/child-okr-title.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [ChildOkrComponent, ChildOkrTitleComponent],
  imports: [
    CommonModule,
    ChildOkrRoutingModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatTooltipModule,
  ],
})
export class ChildOkrModule {}
