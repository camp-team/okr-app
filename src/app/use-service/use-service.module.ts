import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UseServiceRoutingModule } from './use-service-routing.module';
import { UseServiceComponent } from './use-service/use-service.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [UseServiceComponent],
  imports: [CommonModule, UseServiceRoutingModule, SharedModule],
})
export class UseServiceModule {}
