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
import { HowToUseComponent } from '../how-to-use/how-to-use.component';
import { SignupFooterComponent } from '../signup-footer/signup-footer.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    AboutComponent,
    PointsComponent,
    HeroComponent,
    HowToUseComponent,
    SignupFooterComponent,
  ],
  imports: [
    CommonModule,
    AboutRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
    MatDialogModule,
    SharedModule,
  ],
})
export class AboutModule {}
