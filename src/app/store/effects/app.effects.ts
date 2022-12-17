import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { GetPosts, EnumPostAction, GetPostsSuccess} from '../actions/post.actions';
import { catchError, switchMap } from 'rxjs/operators';
import { Post } from '../../interfaces/post';
import { PostService } from '../../services/post.service';

@Injectable()
export class PostEffect {
  constructor( private _actions$ : Actions,
               private _postService : PostService ) {
  }
 
  @Effect()
  getPosts$ = this._actions$.pipe(
    ofType<GetPosts>(EnumPostAction.GetPosts),
    switchMap(() => this._postService.fetchPosts()),
    switchMap((postHttp: Post[]) => {
      return of(new GetPostsSuccess(postHttp))
    }),
    // catchError((err)=> of(new EnumPostAction.GetPostsError(err)))
  );

 
}