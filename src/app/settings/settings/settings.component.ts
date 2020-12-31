import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DeleteAccountDialogComponent } from 'src/app/delete-account-dialog/delete-account-dialog.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  openDeleteAccountDialog() {
    this.dialog.open(DeleteAccountDialogComponent, {
      width: '400px',
      autoFocus: false,
      restoreFocus: false,
    });
  }
}
