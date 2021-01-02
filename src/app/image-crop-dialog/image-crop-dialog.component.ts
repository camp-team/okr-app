import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageCroppedEvent } from 'ngx-image-cropper';
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
    private dialogRef: MatDialogRef<ImageCropDialogComponent>
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
}
