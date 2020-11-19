import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about/about.component';
import { MatButtonModule } from '@angular/material/button';
import { PointsComponent } from '../points/points.component';
import { MatIconModule } from '@angular/material/icon';
import { HeroComponent } from '../hero/hero.component';

@NgModule({
  declarations: [AboutComponent, PointsComponent, HeroComponent],
  imports: [CommonModule, AboutRoutingModule, MatButtonModule, MatIconModule],
})
export class AboutModule {}
