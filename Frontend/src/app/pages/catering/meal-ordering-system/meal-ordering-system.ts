import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api/api';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-meal-ordering-system',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './meal-ordering-system.html',
  styleUrl: './meal-ordering-system.css',
})
export class MealOrderingSystem {
  title = 'Meal Ordering System';
  orders: any[] = [];
  showImportSection = false;
  loading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  searchTerm: string = '';
  page: number = 1;
  limit: number = 10;
  totalOrders: number = 0;
  totalPages: number = 0;
  currentPage = 1;
  pageSize = 10;
  sortColumn = '';
  sortDirection = 'asc';
  isViewDetailModal: boolean = false;
  detailOrder: any = null;
  isViewUpdateTakenModal: boolean = false;
  selectedOrderId: number | null = null;

  openConfirmModal(orderId: number) {
    this.selectedOrderId = orderId;
    this.isViewUpdateTakenModal = true;
  }

  constructor(private apiService: ApiService, private router: Router) {}

  filters = {
    name: '',
    date: '',
  };

  // Pagination properties

  applyFilters() {
    this.currentPage = 1;
    this.fetchMealTodayData();
  }

  clearFilters() {
    this.filters = { name: '', date: '' };
    this.currentPage = 1;
    this.fetchMealTodayData();
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.orders.sort((a, b) => {
      const valueA = a[column as keyof typeof a];
      const valueB = b[column as keyof typeof b];

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  async viewDetails(mealId: number) {
    this.loading = true;
    this.isViewDetailModal = true;
    try {
      const res = await this.apiService.get(`/meal/${mealId}`);
      this.detailOrder = res.data.data; // simpan detail
    } catch (error: any) {
      this.errorMessage = 'Oops, ada kesalahan. silakan coba lagi nanti!';
      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
    } finally {
      this.loading = false;
    }
  }

  closeModal() {
    this.isViewDetailModal = false;
    this.isViewUpdateTakenModal = false;
    this.detailOrder = null;
  }

  editOrder(order: any) {
    // In a real application, this would open an edit form
    console.log('Edit order:', order);
    alert(
      `Edit form for ${order.nama} (${order.prNumber}) would be shown here.`
    );
  }

  toggleImportSection() {
    this.showImportSection = !this.showImportSection;
  }

  exportData() {
    // In a real application, this would export data to CSV or Excel
    console.log('Exporting data...');
    alert('Data export functionality would be implemented here.');
  }

  handleFileImport(event: any) {
    // In a real application, this would handle file import
    const file = event.target.files[0];
    if (file) {
      console.log('Importing file:', file.name);
      alert(`File "${file.name}" would be processed for import.`);
    }
  }

  downloadSample() {
    // In a real application, this would download a sample file
    console.log('Downloading sample file...');
    alert('Sample file download would be implemented here.');
  }

  async fetchMealTodayData() {
    this.loading = true;
    try {
      const params = new URLSearchParams();

      if (this.filters.name) {
        params.append('search', this.filters.name);
      }

      if (this.filters.date) {
        params.append('date', this.filters.date);
      }

      params.append('page', this.currentPage.toString());
      params.append('limit', this.pageSize.toString());

      const res = await this.apiService.get(`/meal-today?${params.toString()}`);

      this.orders = res.data.data;
      this.totalOrders = res.data.paginate.total;
      this.totalPages = res.data.paginate.last_page;
    } catch (error: any) {
      this.errorMessage = 'Oops, ada kesalahan. silakan coba lagi nanti!';
      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
    } finally {
      this.loading = false;
    }
  }

  getPageNumbers() {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  get filteredOrders() {
    return this.orders.filter((order) => {
      const nameMatch = (order.name || '')
        .toLowerCase()
        .includes(this.filters.name.toLowerCase());
      const dateMatch =
        !this.filters.date || order.tanggal === this.filters.date;
      return nameMatch && dateMatch;
    });
  }

  get paginatedOrders() {
    return this.orders;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchMealTodayData();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchMealTodayData();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchMealTodayData();
    }
  }

  async confirmTakeOrder() {
    if (!this.selectedOrderId) return;

    try {
      await this.apiService.put(`/meal/taken/${this.selectedOrderId}`, {
        is_taken: true,
      });

      this.fetchMealTodayData();
      this.successMessage = 'Data berhasil diubah!';
      setTimeout(() => {
        this.successMessage = null;
      }, 3000);
    } catch (error) {
      this.errorMessage = 'Oops, ada kesalahan. silakan coba lagi nanti!';
      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
    } finally {
      this.closeModal();
    }
  }
  // Helper function for template access
  Math = Math;

  ngOnInit(): void {
    this.fetchMealTodayData();
    const state = history.state;
    if (state?.message) {
      this.successMessage = state.message;

      setTimeout(() => {
        this.successMessage = null;
      }, 5000);
    }
  }
}
