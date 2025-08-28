import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [CommonModule, FormsModule],
  standalone: true,
})
export class LoginComponent implements OnInit {
  // username = '';
  username = '';
  password = '';
  errorMessage = '';
  loading = false;
  error = '';

  constructor(private router: Router, private auth: AuthService) {}

  onKeyPress(event: KeyboardEvent) {
    if (event.key == 'Enter') {
      this.login();
    }
  }

  async login() {
    this.errorMessage = '';
    this.loading = true;

    if (!this.username?.trim()) {
      this.errorMessage = 'Please enter your username';
      this.loading = false;
      return;
    }

    if (!this.password?.trim()) {
      this.errorMessage = 'Please enter your password';
      this.loading = false;
      return;
    }

    try {
      await this.auth.login(this.username, this.password);
      this.router.navigateByUrl('/gas/home');
    } catch (error: any) {
      this.errorMessage =
        error?.response?.data?.message ||
        'Login failed. Please check your credentials.';
    } finally {
      this.loading = false;
    }
  }

  ngOnInit(): void {
    const storedToken = window.localStorage.getItem(
      environment.access_token_key
    );
    if (
      storedToken !== null &&
      storedToken !== undefined &&
      storedToken.length > 0
    ) {
      this.router.navigateByUrl('/');
    }
  }
}
