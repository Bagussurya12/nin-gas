import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../../../services/api/api';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './create.html',
  styleUrl: './create.css',
})
export class Create {
  constructor(private apiService: ApiService, private router: Router) {}
  guest = {
    fullname: '',
    id_card: '',
    email: '',
    phone: '',
    company: '',
    visit_purpose: '',
    visit_date: '',
    status: '',
    check_in: '',
    check_out: '',
  };

  loading = false;
  error: string | null = null;
  success: string | null = null;

  async createGuest() {
    this.loading = true;
    this.error = null;
    this.success = null;

    try {
      const payload: any = { ...this.guest };

      if (!payload.email) delete payload.email;
      if (!payload.phone) delete payload.phone;
      if (!payload.company) delete payload.company;
      if (!payload.visit_purpose) delete payload.visit_purpose;
      if (!payload.visit_date) delete payload.visit_date;
      if (!payload.check_in) delete payload.check_in;
      if (!payload.check_out) delete payload.check_out;

      await this.apiService.post('/guests', payload, {
        'Content-Type': 'application/json',
      });
      this.success = 'Tamu berhasil ditambahkan!';
      this.guest = {
        fullname: '',
        id_card: '',
        email: '',
        phone: '',
        company: '',
        visit_purpose: '',
        visit_date: '',
        status: 'expected',
        check_in: '',
        check_out: '',
      };
      this.router.navigate(['/gas/guest'], {
        state: { message: 'Tamu berhasil ditambahkan!' },
      });
    } catch (err: any) {
      this.error = err.response?.data?.message || 'Gagal menambahkan tamu';
    } finally {
      this.loading = false;
    }
  }
}
