import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OkrProjectRoutingModule } from './okr-project-routing.module';
import { OkrProjectComponent } from './okr-project/okr-project.component';
import { ParentOkrComponent } from '../home/parent-okr/parent-okr.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [OkrProjectComponent, ParentOkrComponent],
  imports: [
    CommonModule,
    OkrProjectRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
  ],
})
export class OkrProjectModule {}
