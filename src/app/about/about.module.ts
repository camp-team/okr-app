import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about/about.component';
import { MatButtonModule } from '@angular/material/button';
import { PointsComponent } from '../points/points.component';
import { MatIconModule } from '@angular/material/icon';
import { HeroComponent } from '../hero/hero.component';
import { HeaderComponent } from '../header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [
    AboutComponent,
    PointsComponent,
    HeroComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    AboutRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
  ],
})
export class AboutModule {}
