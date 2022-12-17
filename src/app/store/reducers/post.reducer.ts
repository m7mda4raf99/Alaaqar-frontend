import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { PostActions, EnumPostAction } from '../actions/post.actions';
import { initialPostsState } from '../state/post.state';
 

export interface State {

}

export const reducers: ActionReducerMap<State> = {
  
 postReducer (
  state = initialPostsState,
  action: PostActions
){
  switch (action.type) {
    case EnumPostAction.GetPostsSuccess: {
      return {
        ...state,
        posts: action.payload
      };
    }
    case EnumPostAction.GetPosts: {
      return {
        ...state,
      };
    }
    
    default: {
      return state;
    }
    }
  }
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
