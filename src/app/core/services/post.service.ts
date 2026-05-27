import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { Post } from '../models/post.model';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private api = inject(ApiService);
  private jsonUrl = environment.jsonApiUrl;

  private postsSubject$ = new BehaviorSubject<Post[]>([]);
  public posts$ = this.postsSubject$.asObservable();

  getPostsFromServer(): Observable<Post[]> {
    if (this.postsSubject$.value.length > 0) {
      return of(this.postsSubject$.value);
    }
    return this.api
      .get<Post[]>(`${this.jsonUrl}/posts`)
      .pipe(tap((posts) => this.postsSubject$.next(posts)));
  }

  getPostsById(id: number): Observable<Post> {
    return this.api.get<Post>(`${this.jsonUrl}/posts/${id}`);
  }

  getCommentByPostId(id: number): Observable<Comment[]> {
    return this.api.get<Comment[]>(`${this.jsonUrl}/posts/${id}/comments`);
  }

  getPostsPaged(page: number, limit: number): Observable<Post[]> {
    return this.api.get<Post[]>(`${this.jsonUrl}/posts`, {
      params: {
        _page: page,
        _limit: limit,
      },
    });
  }

  // createPost(post: any): Observable<any> {
  //   return this.api.post<Post>(`${this.jsonUrl}/posts`, post).pipe(
  //     tap((newPost: any) => {
  //       const mockPost = { ...newPost };
  //       const currentPosts = this.postsSubject$.value;
  //       this.postsSubject$.next([...currentPosts, mockPost]);
  //     }),
  //   );
  // }
}
