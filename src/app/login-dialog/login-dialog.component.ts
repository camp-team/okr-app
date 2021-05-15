import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
})
export class LoginDialogComponent implements OnInit {
  user$: Observable<User> = this.authService.user$;
  userName: string;

  constructor(
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      this.userName = user.name;
    });
  }

  close() {
    this.dialogRef.close();
  }

  createOkr() {
    this.dialogRef.close();
    this.router.navigateByUrl('/manage/edit');
  }
}
