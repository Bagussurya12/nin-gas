import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../../services/api/api';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],

  templateUrl: './create.html',
  styleUrls: ['./create.css'],
})
export class Create {
  fullname: string = '';
  username: string = '';
  email: string = '';
  password: string = '';

  isLoading: boolean = false;
  message: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  async onSubmit() {
    this.isLoading = true;
    this.message = '';

    try {
      const payload = {
        fullname: this.fullname,
        username: this.username,
        email: this.email,
        password: this.password,
      };

      await this.apiService.post('/users', payload, {
        'Content-Type': 'application/json',
      });

      this.message = 'User berhasil dibuat!';
      this.fullname = '';
      this.username = '';
      this.email = '';
      this.password = '';
      this.router.navigate(['/gas/settings/users/user-management'], {
        state: { message: 'User berhasil dibuat!' },
      });
    } catch (error: any) {
      console.error(error);
      this.message = 'Gagal membuat user!';
    } finally {
      this.isLoading = false;
    }
  }
}
