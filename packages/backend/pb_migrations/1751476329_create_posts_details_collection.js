/// <reference path="../pb_data/types.d.ts" />

migrate(
	(app) => {
		const postDetails = new Collection({
			type: 'view',
			name: 'posts_details',
			listRule: '',
			viewRule: '',
			viewQuery: `SELECT (ROW_NUMBER() OVER()) as id, posts.id as post, users.username, users.avatar, users.'avatarURL', (SELECT COUNT(*) FROM posts_likes WHERE posts_likes.post = posts.id) as 'likes'
				FROM posts
				INNER JOIN users ON posts.author = users.id`
		});

		app.save(postDetails);
	},
	(app) => {
		const postDetails = app.findCollectionByNameOrId('posts_details');
		app.delete(postDetails);
	}
);
