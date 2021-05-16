import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParentOkrFormRoutingModule } from './parent-okr-form-routing.module';
import { ParentOkrFormComponent } from './parent-okr-form/parent-okr-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [ParentOkrFormComponent],
  imports: [
    CommonModule,
    ParentOkrFormRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatDialogModule,
  ],
  providers: [],
})
export class ParentOkrFormModule {}
