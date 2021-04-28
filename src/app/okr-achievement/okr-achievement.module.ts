import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OkrAchievementRoutingModule } from './okr-achievement-routing.module';
import { OkrAchievementComponent } from './okr-achievement/okr-achievement.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [OkrAchievementComponent],
  imports: [
    CommonModule,
    OkrAchievementRoutingModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class OkrAchievementModule {}
