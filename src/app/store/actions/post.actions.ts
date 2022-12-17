import { Action } from '@ngrx/store';
import { Post } from '../../interfaces/post';
 
export enum EnumPostAction {
  GetPosts = '[Post] Get Posts',
  GetPostsSuccess = '[Post] Get Posts Success',
  GetPostsError = '[Post] Get Posts Error'
}
 
export class GetPosts implements Action {
  public readonly type = EnumPostAction.GetPosts;
}
 
export class GetPostsSuccess implements Action {
  public readonly type = EnumPostAction.GetPostsSuccess;
  constructor(public payload: Post[]) {}
}
 
export class GetPostsError implements Action {
  public readonly type = EnumPostAction.GetPostsError;
  // constructor(public payload: Post[]) {}
}
export type PostActions = GetPosts | GetPostsSuccess;