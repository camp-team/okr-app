import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SiteFooterComponent } from '../site-footer/site-footer.component';

@NgModule({
  declarations: [SiteFooterComponent],
  imports: [CommonModule, SharedRoutingModule],
  exports: [SiteFooterComponent],
})
export class SharedModule {}
