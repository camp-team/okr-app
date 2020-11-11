import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about/about.component';
import { MatButtonModule } from '@angular/material/button';
import { PointsComponent } from '../points/points.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [AboutComponent, PointsComponent],
  imports: [CommonModule, AboutRoutingModule, MatButtonModule, MatIconModule],
})
export class AboutModule {}
