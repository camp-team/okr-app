import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { OkrComponent } from './okr/okr.component';
import { MatCardModule } from '@angular/material/card';
import { HomeDetailComponent } from '../home-detail/home-detail.component';

@NgModule({
  declarations: [HomeComponent, OkrComponent, HomeDetailComponent],
  imports: [CommonModule, HomeRoutingModule, MatCardModule],
})
export class HomeModule {}
