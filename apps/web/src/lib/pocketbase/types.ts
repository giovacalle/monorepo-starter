import type { PostsResponse } from './pb-schema';

interface PostsDetails {
	avatar: string;
	avatarURL: string;
	username: string;
	likes: number;
}

interface PostsLikes {
	id: string;
}

interface PostExpand {
	posts_details_via_post: [PostsDetails];
	posts_likes_via_post?: [PostsLikes];
}

export interface PostWithExpand extends PostsResponse {
	expand: PostExpand;
}
