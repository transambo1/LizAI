import { Component, Input, Output, EventEmitter } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() pageSize = 5;
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  readonly sizeOptions = [5, 8, 10];

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  onSizeChange(newSize: number) {
    this.pageSizeChange.emit(newSize);
  }
}
