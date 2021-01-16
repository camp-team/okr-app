import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings/settings.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCropDialogComponent } from '../image-crop-dialog/image-crop-dialog.component';

@NgModule({
  declarations: [SettingsComponent, ImageCropDialogComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    ImageCropperModule,
  ],
})
export class SettingsModule {}
