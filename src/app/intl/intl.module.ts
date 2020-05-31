import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntlRoutingModule } from './intl-routing.module';
import { IntlComponent } from './intl/intl.component';

@NgModule({
  declarations: [IntlComponent],
  imports: [CommonModule, IntlRoutingModule],
})
export class IntlModule {}
