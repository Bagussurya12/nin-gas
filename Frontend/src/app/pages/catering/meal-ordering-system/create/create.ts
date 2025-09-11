import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { ApiService } from '../../../../services/api/api';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface MealRequestDetail {
  date: Date;
  meal_type: string;
  is_taken: boolean;
}

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create.html',
  styleUrl: './create.css',
})
export class Create implements OnInit {
  mealRequestForm: FormGroup;
  isLoading = false;
  employees: any[] = [];
  filteredEmployees: any[] = [];
  showSuggestions = false;

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
    this.loadEmployees();
    this.addDetail(); // Add one detail row by default
  }

  get details(): FormArray {
    return this.mealRequestForm.get('details') as FormArray;
  }

  createDetail(): FormGroup {
    return this.fb.group({
      date: ['', Validators.required],
      meal_type: ['', Validators.required],
      is_taken: [false],
    });
  }

  addDetail(): void {
    if (this.details.length < 5) {
      this.details.push(this.createDetail());
    }
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

    this.loadEmployees(value, 1, 10); // panggil API dengan search
    this.showSuggestions = true;
  }

  onEmployeeSelect(emp: any): void {
    // isi form dengan data employee yang dipilih
    this.mealRequestForm.patchValue({
      pr_number: emp.strprno,
      name: emp.strname,
      section: emp.strsectdesc || emp.strsect || '',
      shift: emp.strshift || '',
    });
    this.mealRequestForm.get('shift')?.disable();
    this.mealRequestForm.get('section')?.disable();
    this.mealRequestForm.get('name')?.disable();

    this.filteredEmployees = [];
    this.showSuggestions = false;
  }

  async onSubmit(): Promise<void> {
    console.log('onSubmit dipanggil', this.mealRequestForm.value);

    // Gunakan getRawValue() agar field yang disable tetap dikirim
    const payload = this.mealRequestForm.getRawValue();

    if (this.mealRequestForm.valid || true) {
      // jika mau tetap submit walau ada disabled
      this.isLoading = true;

      try {
        const response = await this.apiService.post('/meal', payload);
        this.isLoading = false;
        alert('Meal request created successfully!');
        this.router.navigate(['/meal-ordering-system']);
      } catch (error) {
        this.isLoading = false;
        console.error('Error creating meal request:', error);
        alert('Failed to create meal request. Please try again.');
      }
    } else {
      Object.keys(this.mealRequestForm.controls).forEach((key) => {
        this.mealRequestForm.get(key)?.markAsTouched();
      });

      this.details.controls.forEach((control) => {
        Object.keys(control).forEach((key) => {
          control.get(key)?.markAsTouched();
        });
      });
    }
  }
}
