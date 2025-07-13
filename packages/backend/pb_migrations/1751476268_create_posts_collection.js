/// <reference path="../pb_data/types.d.ts" />

migrate(
	(app) => {
		const users = app.findCollectionByNameOrId('users');

		const posts = new Collection({
			type: 'base',
			name: 'posts',
			listRule: '',
			viewRule: '',
			createRule: "@request.auth.id != ''",
			updateRule: '@request.auth.id = author',
			deleteRule: '@request.auth.id = author',
			fields: [
				{
					type: 'text',
					name: 'title',
					max: 100,
					required: true
				},
				{
					type: 'text',
					name: 'content',
					required: true
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
		app.save(posts);
	},
	(app) => {
		const posts = app.findCollectionByNameOrId('posts');
		app.delete(posts);
	}
);
