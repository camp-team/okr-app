import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-image-crop-dialog',
  templateUrl: './image-crop-dialog.component.html',
  styleUrls: ['./image-crop-dialog.component.scss'],
})
export class ImageCropDialogComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  imageSelecter: any;

  isLoading: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      event: any;
      imageSelecter: any;
    },
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ImageCropDialogComponent>,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.isLoading = true;
    this.imageChangedEvent = this.data.event;
    this.imageSelecter = this.data.imageSelecter;
  }

  ngOnInit(): void {}

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    this.isLoading = false;
  }

  loadImageFailed() {
    this.dialogRef.close();
    this.snackBar.open('画像の読み込みに失敗しました', '閉じる');
  }

  resetInput() {
    this.imageChangedEvent = '';
    this.imageSelecter.value = '';
    this.dialogRef.close();
  }

  changeAvatar() {
    if (this.croppedImage) {
      this.dialogRef.close();
      this.userService
        .uploadAvatar(this.authService.uid, this.croppedImage)
        .then(() => {
          this.imageChangedEvent = '';
          this.imageSelecter.value = '';
          this.snackBar.open('画像を変更しました。', '閉じる');
        });
    }
  }
}
