import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Post } from '../interfaces/post';
import { select, Store } from '@ngrx/store';
import { PostState } from '../store/state/post.state';
import { selectedPosts } from '../store/selector/post.selector';

 
// export const selectedPosts = 

@Injectable()
export class PostService {
    // public posts$: Observable<Post[]>;
 
    public constructor(private _http: HttpClient, private _store: Store<PostState>) {
      // this.posts$= of();
    }
    public fetchPosts(): Observable<[Post]> {
      return this._http.get<[Post]>('https://jsonplaceholder.typicode.com/posts');
    
    }
    

}