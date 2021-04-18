import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OkrAchievementRoutingModule } from './okr-achievement-routing.module';
import { OkrAchievementComponent } from './okr-achievement/okr-achievement.component';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  declarations: [OkrAchievementComponent],
  imports: [CommonModule, OkrAchievementRoutingModule, MatIconModule],
})
export class OkrAchievementModule {}
