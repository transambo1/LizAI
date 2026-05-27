import { Component, OnInit, inject, signal } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BaseTableComponent } from '../../../shared/components/base-table/base-table.component';
import { PostService } from '../../../core/services/post.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [BaseTableComponent, MatCardModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './post-list.component.html',
})
export class PostListComponent implements OnInit {
  private postService = inject(PostService);
  private router = inject(Router);

  posts = signal<string[]>([]);
  isLoading = signal(true);

  postColumns = [
    { key: 'id', label: 'ID' },
    { key: 'userId', label: 'Người đăng' },
    { key: 'title', label: 'Tiêu đề' },
    { key: 'body', label: 'Nội dung' },
    { key: 'actions', label: 'Thao tác', isAction: true, buttons: ['view'] },
  ];

  totalPosts = 100;
  currentPage = 1;
  pageSize = 10;

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.isLoading.set(true);
    this.postService.getPostsPaged(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.posts.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  onView(post: string) {
    this.router.navigate(['/admin/posts', post.id]);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadPosts();
  }

  onSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadPosts();
  }
}
