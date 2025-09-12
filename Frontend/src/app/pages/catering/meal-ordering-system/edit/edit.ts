import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { ApiService } from '../../../../services/api/api';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface MealRequestDetail {
  date: Date;
  is_taken: boolean;
}

@Component({
  selector: 'app-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class Edit {
  mealRequestForm: FormGroup;
  isLoading = false;
  employees: any[] = [];
  filteredEmployees: any[] = [];
  showSuggestions = false;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  private MealReqId!: string;
  private detailId!: string;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private apiService: ApiService
  ) {
    this.mealRequestForm = this.fb.group({
      pr_number: ['', Validators.required],
      name: ['', Validators.required],
      section: [''],
      shift: [''],
      confirmation: [false],
      details: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.MealReqId = this.route.snapshot.paramMap.get('id')!;
    this.detailId = this.route.snapshot.queryParamMap.get('detailId')!; // ambil detailId dari query param
    this.loadEmployees();
    this.getMealData();
  }

  get details(): FormArray {
    return this.mealRequestForm.get('details') as FormArray;
  }

  removeDetail(index: number): void {
    this.details.removeAt(index);
  }

  async loadEmployees(
    search: string = '',
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const res = await this.apiService.get(
        `/memp?search=${search}&page=${page}&limit=${limit}`
      );
      this.employees = res.data.data || [];
      this.filteredEmployees = [...this.employees];
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  }

  filterEmployees(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    if (!value) {
      this.filteredEmployees = [];
      this.showSuggestions = false;
      return;
    }

    this.loadEmployees(value, 1, 10);
    this.showSuggestions = true;
  }

  onEmployeeSelect(emp: any): void {
    this.mealRequestForm.patchValue({
      pr_number: emp.strprno,
      name: emp.strname,
      section: emp.strsectdesc || emp.strsect || '',
      shift: emp.strshift || '',
    });

    this.details.controls.forEach((group) => {
      group.patchValue({ emp_pr_number: emp.strprno });
    });

    this.mealRequestForm.get('shift')?.disable();
    this.mealRequestForm.get('section')?.disable();
    this.mealRequestForm.get('name')?.disable();

    this.filteredEmployees = [];
    this.showSuggestions = false;
  }

  async onSubmit(): Promise<void> {
    this.isLoading = true;
    try {
      const payload = this.mealRequestForm.getRawValue();
      if (!this.mealRequestForm.valid) {
        Object.keys(this.mealRequestForm.controls).forEach((key) => {
          this.mealRequestForm.get(key)?.markAsTouched();
        });

        (this.details.controls as FormGroup[]).forEach((group) => {
          Object.values(group.controls).forEach((ctrl) => ctrl.markAsTouched());
        });

        alert('Please fill all required fields.');
        return;
      }

      await this.apiService.put(`/meal/${this.MealReqId}`, payload, {
        'Content-Type': 'application/json',
      });

      this.router.navigate(['/gas/catering/meal-ordering-system'], {
        state: { successMessage: 'Data Berhasil Diupdate' },
      });
    } catch (error) {
      console.error('Error creating meal request:', error);
      alert('Failed to create meal request. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  async getMealData() {
    try {
      const url = this.detailId
        ? `/meal/${this.MealReqId}?detailId=${this.detailId}`
        : `/meal/${this.MealReqId}`;

      const response = await this.apiService.get(url);
      const reqMeal = response.data.data;

      this.mealRequestForm.patchValue({
        pr_number: reqMeal.pr_number,
        name: reqMeal.name,
        section: reqMeal.section,
        shift: reqMeal.shift,
        confirmation: reqMeal.confirmation,
      });

      this.details.clear();

      reqMeal.details.forEach((detail: any) => {
        const dateValue = new Date(detail.date).toISOString().split('T')[0]; // "YYYY-MM-DD"
        const detailGroup = this.fb.group({
          id: [detail.id],
          emp_pr_number: [detail.emp_pr_number],
          date: [dateValue, Validators.required], // <-- patch dengan format YYYY-MM-DD
          is_taken: [detail.is_taken],
          is_selected: [detail.is_selected],
        });
        this.details.push(detailGroup);
      });

      this.success = 'Berhasil ambil data';
      setTimeout(() => {
        this.success = null;
      }, 2000);
    } catch (err: any) {
      this.error = err.response?.data?.message || 'Gagal ambil data';
    }
  }
}
