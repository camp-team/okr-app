import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OkrAchievementRoutingModule } from './okr-achievement-routing.module';
import { OkrAchievementComponent } from './okr-achievement/okr-achievement.component';

@NgModule({
  declarations: [OkrAchievementComponent],
  imports: [CommonModule, OkrAchievementRoutingModule],
})
export class OkrAchievementModule {}
