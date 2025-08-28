import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../../../services/api/api';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.html',
  imports: [CommonModule, NgFor, NgIf, RouterModule, FormsModule],
  styleUrls: ['./user-management.css'],
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  loading: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;
  showDeleteModal = false;
  selectedUser: any = null;
  searchTerm: string = '';
  page: number = 1;
  limit: number = 10;
  totalPages: number = 1;

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
      const res = await this.apiService.get(
        `/users?search=${this.searchTerm}&page=${this.page}&limit=${this.limit}`
      );
      this.users = res.data.data;
      this.totalPages = res.data.pagination.totalPages;
    } catch (err: any) {
      console.error(err);
      this.error = err.response?.data?.message || 'Failed to load users';
    } finally {
      this.loading = false;
    }
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.page = 1; // reset ke page 1 saat search
    this.getUsers();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.page = page;
    this.getUsers();
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
