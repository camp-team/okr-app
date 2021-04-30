import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { loadStripe } from '@stripe/stripe-js';
import { DeleteAccountDialogComponent } from 'src/app/delete-account-dialog/delete-account-dialog.component';
import { ImageCropDialogComponent } from 'src/app/image-crop-dialog/image-crop-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  user$ = this.authService.user$;

  constructor(
    private dialog: MatDialog,
    public authService: AuthService,
    public customerService: CustomerService
  ) {}

  ngOnInit(): void {}

  logout() {
    this.authService.logout();
  }

  openDeleteAccountDialog() {
    this.dialog.open(DeleteAccountDialogComponent, {
      width: '450px',
      autoFocus: false,
      restoreFocus: false,
    });
  }

  openImageCropDialog(event: any, imageSelecter: any): void {
    this.dialog.open(ImageCropDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      data: { event, imageSelecter },
    });
  }

  async redirectToCheckout() {
    const stripe = await loadStripe(environment.stripe.publicKey);
    this.customerService.checkoutSession().then((ref) => {
      stripe.redirectToCheckout({ sessionId: ref });
    });
  }
}
