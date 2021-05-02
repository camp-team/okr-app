import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about/about.component';
import { MatButtonModule } from '@angular/material/button';
import { PointsComponent } from '../points/points.component';
import { MatIconModule } from '@angular/material/icon';
import { HeroComponent } from '../hero/hero.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UseComponent } from '../use/use.component';
import { CvComponent } from '../cv/cv.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AboutComponent,
    PointsComponent,
    HeroComponent,
    UseComponent,
    CvComponent,
  ],
  imports: [
    CommonModule,
    AboutRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
    MatDialogModule,
  ],
})
export class AboutModule {}
