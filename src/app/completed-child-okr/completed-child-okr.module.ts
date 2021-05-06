import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompletedChildOkrRoutingModule } from './completed-child-okr-routing.module';
import { CompletedChildOkrComponent } from './completed-child-okr/completed-child-okr.component';
import { CompletedChildOkrTitleComponent } from '../completed-child-okr-title/completed-child-okr-title.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [CompletedChildOkrComponent, CompletedChildOkrTitleComponent],
  imports: [
    CommonModule,
    CompletedChildOkrRoutingModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatTooltipModule,
  ],
})
export class CompletedChildOkrModule {}
