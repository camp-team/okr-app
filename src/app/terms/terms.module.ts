import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermsRoutingModule } from './terms-routing.module';
import { TermsComponent } from './terms/terms.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [TermsComponent],
  imports: [CommonModule, TermsRoutingModule, SharedModule],
})
export class TermsModule {}
