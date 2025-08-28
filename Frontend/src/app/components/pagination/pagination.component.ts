import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() perPage: number = 10;
  @Input() totalItems: number = 0;
  @Input() currentPage: number = 1;
  @Output() selectedPage = new EventEmitter<number>();

  totalPages: number = 0;
  roundedTotalPages: number = 0;
  pages: number[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.validateInputs();
    this.calculatePages();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.validateInputs();
    this.calculatePages();
  }

  private validateInputs(): void {
    // Pastikan currentPage adalah number dan >= 1
    this.currentPage = Math.max(1, +this.currentPage || 1);
    
    // Pastikan perPage adalah number dan >= 1
    this.perPage = Math.max(1, +this.perPage || 10);
    
    // Pastikan totalItems adalah number dan >= 0
    this.totalItems = Math.max(0, +this.totalItems || 0);
  }

  calculatePages(): void {
    this.totalPages = this.totalItems / this.perPage;
    this.roundedTotalPages = Math.ceil(this.totalPages);
    this.pages = this.getPages(this.currentPage, this.roundedTotalPages);
  }

  selectPage(page: number | string): void {
    const pageNumber = Math.max(1, Math.min(this.roundedTotalPages, +page || 1));
    
    if (pageNumber === this.currentPage) {
      return;
    }

    console.log('Page selected:', {
      from: this.currentPage,
      to: pageNumber,
      totalPages: this.roundedTotalPages
    });

    this.selectedPage.emit(pageNumber);
    
    this.router.navigate([], {
      queryParams: { page: pageNumber },
      queryParamsHandling: 'merge',
    });
  }

  private getPages(current: number, total: number): number[] {
    current = Math.max(1, Math.min(current, total));
    total = Math.max(1, total);

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (current <= 4) {
      return [1, 2, 3, 4, 5, -1, total];
    }

    if (current >= total - 3) {
      return [1, -1, total-4, total-3, total-2, total-1, total];
    }

    return [1, -1, current-1, current, current+1, -1, total];
  }
}