import { createSelector } from '@ngrx/store';
 
const selectPosts = (state: any) => state.hasOwnProperty('posts') ? state.posts : '';
 
export const selectedPosts = createSelector(
  selectPosts,
  (state: any) => {
    return state.hasOwnProperty('posts') ? state.posts : '';
  }
);