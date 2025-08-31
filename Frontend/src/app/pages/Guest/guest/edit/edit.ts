import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api/api';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class Edit {
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
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
  private guestId!: string;

  async updateGuest() {
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

      await this.apiService.put(`/guests/${this.guestId}`, payload, {
        'Content-Type': 'application/json',
      });
      this.success = 'Tamu berhasil diupadate!';
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
        state: { message: 'Tamu berhasil diupadate!' },
      });
    } catch (err: any) {
      this.error = err.response?.data?.message || 'Gagal upadate tamu';
    } finally {
      this.loading = false;
    }
  }

  async getGuestData() {
    try {
      const response = await this.apiService.get(`/guests/${this.guestId}`);
      const guest = response.data.data;

      this.guest.fullname = guest.fullname;
      this.guest.id_card = guest.id_card;
      this.guest.email = guest.email;
      this.guest.phone = guest.phone;
      this.guest.company = guest.company;
      this.guest.visit_purpose = guest.visit_purpose;

      // Format visit_date -> YYYY-MM-DD
      if (guest.visit_date) {
        this.guest.visit_date = guest.visit_date.split('T')[0];
      }

      this.guest.status = guest.status;

      if (guest.check_in) {
        this.guest.check_in = guest.check_in.substring(0, 16);
      }

      if (guest.check_out) {
        this.guest.check_out = guest.check_out.substring(0, 16);
      }

      this.success = 'Berhasil ambil data tamu';
      setTimeout(() => {
        this.success = null;
      }, 2000);
    } catch (err: any) {
      this.error = err.response?.data?.message || 'Gagal update tamu';
    }
  }

  ngOnInit(): void {
    this.guestId = this.route.snapshot.paramMap.get('id')!;
    this.getGuestData();
  }
}
