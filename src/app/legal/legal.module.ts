import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LegalRoutingModule } from './legal-routing.module';
import { LegalComponent } from './legal/legal.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [LegalComponent],
  imports: [CommonModule, LegalRoutingModule, SharedModule],
})
export class LegalModule {}
