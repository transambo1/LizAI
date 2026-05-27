import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TableColumn } from './base-table.interface';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-base-table',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, PaginationComponent],
  templateUrl: './base-table.component.html',
})
export class BaseTableComponent<T> {
  private _data = signal<T[]>([]);

  @Input() set data(value: T[] | null | undefined) {
    this._data.set(value || []);
    if (!this.isServerSide) {
      this.currentPage.set(1);
    }
  }
  @Input() isServerSide = false;
  @Input() totalItems = 0;
  @Input() columns: TableColumn[] = [];

  @Output() view = new EventEmitter<T>();
  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<number>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  pageSize = signal(10);
  currentPage = signal(1);

  paginatedData = computed(() => {
    if (this.isServerSide) return this._data();
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this._data().slice(start, end);
  });

  totalPages = computed(() => {
    const total = this.isServerSide ? this.totalItems : this._data().length;
    const pages = Math.ceil(total / this.pageSize());
    return pages > 0 ? pages : 1;
  });

  onSizeChange(newSize: number) {
    if (this.pageSize() !== Number(newSize)) {
      this.pageSize.set(Number(newSize));
      this.currentPage.set(1);
      this.pageSizeChange.emit(newSize);
    }
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.pageChange.emit(page);
  }

  get displayedColumns(): string[] {
    return this.columns.map((col) => col.key);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCellValue(element: T, key: string): any {
    if (!key.includes('.')) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (element as any)[key];
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return key.split('.').reduce((obj, k) => (obj as any)?.[k], element);
  }
}
