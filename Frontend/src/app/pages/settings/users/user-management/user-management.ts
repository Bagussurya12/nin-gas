import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../../../services/api/api';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.html',
  imports: [CommonModule, NgFor, NgIf, RouterModule],
  styleUrls: ['./user-management.css'],
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  loading: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;
  showDeleteModal = false;
  selectedUser: any = null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getUsers();
    const state = history.state;
    if (state?.message) {
      this.successMessage = state.message;

      setTimeout(() => {
        this.successMessage = null;
      }, 5000);
    }
  }

  async getUsers() {
    this.loading = true;
    this.error = null;

    try {
      const res = await this.apiService.get('/users');
      this.users = res.data.data;
      console.log(this.users);
    } catch (err: any) {
      console.error(err);
      this.error = err.response?.data?.message || 'Failed to load users';
    } finally {
      this.loading = false;
    }
  }

  openDeleteModal(user: any) {
    this.selectedUser = user;
    this.showDeleteModal = true;
  }

  async confirmDelete() {
    if (!this.selectedUser) return;

    try {
      await this.apiService.delete(`/users/${this.selectedUser.id}`);
      this.successMessage = `User "${this.selectedUser.fullname}" berhasil dihapus!`;
      this.showDeleteModal = false;
      this.selectedUser = null;
      this.getUsers();

      setTimeout(() => (this.successMessage = null), 5000);
    } catch (err: any) {
      console.error(err);
      this.showDeleteModal = false;
    }
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.selectedUser = null;
  }
}
