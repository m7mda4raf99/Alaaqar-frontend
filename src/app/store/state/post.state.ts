import { Post } from '../../interfaces/post';
 
export interface PostState {
    posts: Array<Post>;
}
export const initialPostsState: PostState = {
    posts: []
};