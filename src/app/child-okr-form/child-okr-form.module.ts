import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChildOkrFormRoutingModule } from './child-okr-form-routing.module';
import { ChildOkrFormComponent } from './child-okr-form/child-okr-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [ChildOkrFormComponent],
  imports: [
    CommonModule,
    ChildOkrFormRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatFormFieldModule,
    MatStepperModule,
    MatSelectModule,
  ],
})
export class ChildOkrFormModule {}
