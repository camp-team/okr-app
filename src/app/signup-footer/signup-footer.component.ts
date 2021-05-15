import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup-footer',
  templateUrl: './signup-footer.component.html',
  styleUrls: ['./signup-footer.component.scss'],
})
export class SignupFooterComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  login() {
    this.authService.login();
  }
}
