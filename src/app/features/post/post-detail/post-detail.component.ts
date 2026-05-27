import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { PostService } from '../../../core/services/post.service';
import { UserService } from '../../../core/services/user.service';
import { forkJoin } from 'rxjs';
import { Post } from '../../../core/models/post.model';
import { Comment } from '../../../core/models/comment.model';

// 1. TẠO TYPE MỚI: Báo cho TS biết Post này có thêm authorName
export type PostWithAuthor = Post & { authorName?: string };

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    RouterLink,
  ],
  templateUrl: './post-detail.component.html',
})
export class PostDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private postService = inject(PostService);
  // Sửa UserService thành chữ thường cho đúng chuẩn đặt tên biến
  private userService = inject(UserService);

  // 2. Thay Post bằng PostWithAuthor
  post = signal<PostWithAuthor | null>(null);
  comments = signal<Comment[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.loadData(id);
    }
  }

  loadData(id: number) {
    this.isLoading.set(true);

    forkJoin({
      post: this.postService.getPostsById(id),
      comments: this.postService.getCommentByPostId(id),
      users: this.userService.getUsersFromServer(),
    }).subscribe({
      next: (res) => {
        const user = res.users.find((u) => u.id === res.post.userId);

        // 3. Ép kiểu rõ ràng khi gán
        const postWithAuthor: PostWithAuthor = {
          ...res.post,
          authorName: user ? user.name : 'Ẩn danh',
        };

        this.post.set(postWithAuthor);
        this.comments.set(res.comments);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.router.navigate(['/admin/posts']);
      },
    });
  }
}
