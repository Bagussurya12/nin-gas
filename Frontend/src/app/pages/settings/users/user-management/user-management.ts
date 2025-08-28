import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../../../services/api/api';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.html',
  imports: [CommonModule, NgFor, NgIf],
  styleUrls: ['./user-management.css'],
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  async getUsers() {
    this.loading = true;
    this.error = null;

    try {
      const res = await this.apiService.get('/users');
      this.users = res.data.data; // <-- ambil array yang benar
      console.log(this.users);
    } catch (err: any) {
      console.error(err);
      this.error = err.response?.data?.message || 'Failed to load users';
    } finally {
      this.loading = false;
    }
  }
}
