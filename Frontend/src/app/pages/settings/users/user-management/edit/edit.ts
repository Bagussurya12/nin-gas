import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../../services/api/api';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit.html',
  styleUrls: ['./edit.css'],
})
export class Edit implements OnInit {
  fullname: string = '';
  username: string = '';
  email: string = '';
  password: string = '';

  isLoading: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  private userId!: string;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Ambil userId dari URL
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.getUserData();
  }

  async getUserData() {
    try {
      const response = await this.apiService.get(`/users/${this.userId}`);
      const user = response.data.data;

      this.fullname = user.fullname;
      this.username = user.username;
      this.email = user.email;
    } catch (error) {
      console.error(error);
      this.message = 'Gagal memuat data pengguna!';
      this.messageType = 'error';
    }
  }

  async onSubmit() {
    this.isLoading = true;
    this.message = '';

    try {
      const payload: any = {
        fullname: this.fullname,
        username: this.username,
        email: this.email,
      };

      if (this.password.trim() !== '') {
        payload.password = this.password;
      }

      await this.apiService.put(`/users/${this.userId}`, payload, {
        'Content-Type': 'application/json',
      });

      this.message = 'Pengguna berhasil diperbarui!';
      this.messageType = 'success';

      setTimeout(() => {
        this.router.navigate(['/gas/settings/users/user-management'], {
          state: { message: 'Pengguna berhasil diperbarui!' },
        });
      }, 1000);
    } catch (error: any) {
      console.error(error);
      this.message = 'Gagal memperbarui pengguna!';
      this.messageType = 'error';
    } finally {
      this.isLoading = false;
    }
  }
}
