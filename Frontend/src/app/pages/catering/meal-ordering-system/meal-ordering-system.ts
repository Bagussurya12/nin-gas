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

  // Sample data
  orders = [
    {
      prNumber: 'PR-001',
      nama: 'John Doe',
      section: 'HR',
      tanggal: '2023-05-15',
    },
    {
      prNumber: 'PR-002',
      nama: 'Jane Smith',
      section: 'Finance',
      tanggal: '2023-05-16',
    },
    {
      prNumber: 'PR-003',
      nama: 'Robert Johnson',
      section: 'IT',
      tanggal: '2023-05-17',
    },
    {
      prNumber: 'PR-004',
      nama: 'Emily Davis',
      section: 'Marketing',
      tanggal: '2023-05-18',
    },
    {
      prNumber: 'PR-005',
      nama: 'Michael Wilson',
      section: 'Operations',
      tanggal: '2023-05-19',
    },
    {
      prNumber: 'PR-006',
      nama: 'Sarah Brown',
      section: 'Sales',
      tanggal: '2023-05-20',
    },
    {
      prNumber: 'PR-007',
      nama: 'David Miller',
      section: 'IT',
      tanggal: '2023-05-21',
    },
    {
      prNumber: 'PR-008',
      nama: 'Lisa Taylor',
      section: 'HR',
      tanggal: '2023-05-22',
    },
    {
      prNumber: 'PR-009',
      nama: 'James Anderson',
      section: 'Finance',
      tanggal: '2023-05-23',
    },
    {
      prNumber: 'PR-010',
      nama: 'Susan Thomas',
      section: 'Marketing',
      tanggal: '2023-05-24',
    },
  ];

  filters = {
    name: '',
    date: '',
  };

  // Pagination properties
  currentPage = 1;
  pageSize = 3;
  sortColumn = '';
  sortDirection = 'asc';

  get filteredOrders() {
    return this.orders.filter((order) => {
      const nameMatch = order.nama
        .toLowerCase()
        .includes(this.filters.name.toLowerCase());
      const dateMatch =
        !this.filters.date || order.tanggal === this.filters.date;
      return nameMatch && dateMatch;
    });
  }

  get totalOrders() {
    return this.filteredOrders.length;
  }

  get totalPages() {
    return Math.ceil(this.totalOrders / this.pageSize);
  }

  get paginatedOrders() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredOrders.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (this.currentPage > 3) {
        pages.push(-1); // -1 represents the ellipsis
      }

      const start = Math.max(2, this.currentPage - 1);
      const end = Math.min(this.totalPages - 1, this.currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (this.currentPage < this.totalPages - 2) {
        pages.push(-1); // -1 represents the ellipsis
      }

      pages.push(this.totalPages);
    }

    return pages;
  }

  clearFilters() {
    this.filters = {
      name: '',
      date: '',
    };
    this.currentPage = 1;
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

  viewDetails(order: any) {
    // In a real application, this would open a modal or navigate to a details page
    console.log('View details for order:', order);
    alert(`Details for ${order.nama} (${order.prNumber}) would be shown here.`);
  }

  // Helper function for template access
  Math = Math;
}
