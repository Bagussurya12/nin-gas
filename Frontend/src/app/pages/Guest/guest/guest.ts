import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../../services/api/api';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-guest',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './guest.html',
  styleUrls: ['./guest.css'],
})
export class GuestComponent {
  guests: any[] = [];
  loading: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;
  showDeleteModal = false;
  selectedGuest: any = null;
  selectedStatus: string = '';
  selectedPurpose: string = '';
  startDate: string = '';
  endDate: string = '';
  searchTerm: string = '';
  page: number = 1;
  limit: number = 10;
  totalPages: number = 1;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.getGuest();
    const state = history.state;
    if (state?.message) {
      this.successMessage = state.message;

      setTimeout(() => {
        this.successMessage = null;
      }, 5000);
    }
  }

  async exportData() {
    this.loading = true;
    this.successMessage = null;
    this.error = null;

    try {
      const params = new URLSearchParams();
      if (this.searchTerm) params.append('search', this.searchTerm);
      if (this.selectedStatus) params.append('status', this.selectedStatus);
      if (this.selectedPurpose)
        params.append('visit_purpose', this.selectedPurpose);
      if (this.startDate) params.append('startDate', this.startDate);
      if (this.endDate) params.append('endDate', this.endDate);

      const response = await this.apiService.get(
        `/guests/export?${params.toString()}`,
        {
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data], {
        type: 'text/csv;charset=utf-8;',
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'guests.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      this.successMessage = `Data tamu berhasil di-export!`;
      setTimeout(() => (this.successMessage = null), 5000);
    } catch (err: any) {
      this.error = err.response?.data?.message || 'Gagal export data tamu';
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  async getGuest() {
    this.loading = true;
    this.error = null;

    try {
      const params = new URLSearchParams();
      if (this.searchTerm) params.append('search', this.searchTerm);
      if (this.selectedStatus) params.append('status', this.selectedStatus);
      if (this.selectedPurpose)
        params.append('visit_purpose', this.selectedPurpose);
      if (this.startDate) params.append('startDate', this.startDate);
      if (this.endDate) params.append('endDate', this.endDate);
      params.append('page', this.page.toString());
      params.append('limit', this.limit.toString());

      const res = await this.apiService.get(`/guests?${params.toString()}`);

      this.guests = res.data.data;
      this.totalPages = res.data.pagination.totalPages;
    } catch (err: any) {
      console.error(err);
      this.error = err.response?.data?.message || 'Failed to load guests';
    } finally {
      this.loading = false;
    }
  }

  formatDateToIndo(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  translateStatus(status: string): string {
    const statusMap: Record<string, string> = {
      expected: 'Dijadwalkan',
      checked_in: 'Check-in',
      checked_out: 'Check-out',
      cancelled: 'Dibatalkan',
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    const classMap: Record<string, string> = {
      expected: 'bg-yellow-100 text-yellow-700',
      checked_in: 'bg-green-100 text-green-700',
      checked_out: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return classMap[status] || 'bg-gray-100 text-gray-700';
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.page = 1;
    this.getGuest();
  }

  onFilterChange() {
    this.page = 1;
    this.getGuest();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.page = page;
    this.getGuest();
  }

  openDeleteModal(user: any) {
    this.selectedGuest = user;
    this.showDeleteModal = true;
  }

  async confirmDelete() {
    if (!this.selectedGuest) return;

    try {
      await this.apiService.delete(`/guests/${this.selectedGuest.id}`);
      this.successMessage = `Tamu "${this.selectedGuest.fullname}" berhasil dihapus!`;
      this.showDeleteModal = false;
      this.selectedGuest = null;
      this.getGuest();

      setTimeout(() => (this.successMessage = null), 5000);
    } catch (err: any) {
      console.error(err);
      this.showDeleteModal = false;
    }
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.selectedGuest = null;
  }
}
