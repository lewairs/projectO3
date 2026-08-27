import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  readonly page = input(1);
  readonly totalPages = input(1);
  readonly pageChange = output<number>();
  readonly pages = computed(() => {
    const total = Math.max(1, this.totalPages());
    const current = Math.min(Math.max(1, this.page()), total);
    const start = Math.max(1, Math.min(current - 2, total - 4));
    return Array.from({ length: Math.min(5, total) }, (_, index) => start + index);
  });

  goTo(page: number): void {
    if (page >= 1 && page <= this.totalPages() && page !== this.page()) this.pageChange.emit(page);
  }
}
