import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TableColumn } from './base-table.interface';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-base-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    PaginationComponent,
    MatTableModule,
  ],
  templateUrl: './base-table.component.html',
})
export class BaseTableComponent {
  private _data = signal<any[]>([]);
  @Input() set data(value: any[]) {
    this._data.set(value || []);
    this.currentPage.set(1);
  }
  @Input() columns: TableColumn[] = [];

  @Output() view = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  pageSize = signal(5);
  currentPage = signal(1);

  // 1. Dùng cái _data() signal để tính, đảm bảo data đổi là nó nhảy theo ngay
  paginatedData = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this._data().slice(start, end);
  });

  totalPages = computed(() => {
    const total = Math.ceil(this._data().length / this.pageSize());
    return total > 0 ? total : 1;
  });

  onSizeChange(newSize: number) {
    this.pageSize.set(newSize);
    this.currentPage.set(1); // Reset về trang 1 khi đổi số lượng hiển thị
  }

    onPageChange(page: number) {
    this.currentPage.set(page);
  }


  get displayedColumns(): string[] {
    return this.columns.map((col) => col.key);
  }

  getCellValue(element: any, key: string) {
    if (!key.includes('.')) return element[key];
    return key.split('.').reduce((obj, k) => obj?.[k], element);
  }
}
