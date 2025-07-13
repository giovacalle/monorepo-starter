/// <reference path="../pb_data/types.d.ts" />

migrate(
	(app) => {
		const posts = app.findCollectionByNameOrId('posts');
		const users = app.findCollectionByNameOrId('users');

		const postsLikes = new Collection({
			type: 'base',
			name: 'posts_likes',
			listRule: '@request.auth.id = author',
			viewRule: '@request.auth.id = author',
			createRule: "@request.auth.id != ''",
			updateRule: '@request.auth.id = author',
			deleteRule: '@request.auth.id = author',
			fields: [
				{
					type: 'relation',
					name: 'post',
					required: true,
					maxSelect: 1,
					collectionId: posts.id,
					cascadeDelete: true
				},
				{
					type: 'relation',
					name: 'author',
					required: true,
					maxSelect: 1,
					collectionId: users.id,
					cascadeDelete: true
				}
			]
		});

		app.save(postsLikes);
	},
	(app) => {
		const postsLikes = app.findCollectionByNameOrId('posts_likes');
		app.delete(postsLikes);
	}
);
