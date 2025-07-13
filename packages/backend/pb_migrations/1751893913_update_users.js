/// <reference path="../pb_data/types.d.ts" />

migrate(
	(app) => {
		const users = app.findCollectionByNameOrId('users');

		users.fields.add(
			new URLField({
				name: 'avatarURL'
			})
		);
		users.fields.add(
			new TextField({
				name: 'lang',
				min: 2,
				max: 2,
				required: true
			})
		);
		users.fields.add(
			new TextField({
				name: 'username',
				required: true
			})
		);

		users.addIndex('idx_username_pb_users_auth', true, 'username');

		users.authAlert = false;
		users.passwordAuth.enabled = false;
		users.otp.enabled = true;
		users.otp.duration = 180; // 3 minutes
		users.otp.length = 8;
		users.oauth2.enabled = true;
		users.oauth2.providers = [
			{
				name: 'google',
				clientId: $os.getenv('GOOGLE_CLIENT_ID'),
				clientSecret: $os.getenv('GOOGLE_CLIENT_SECRET')
			}
		];
		users.oauth2.mappedFields = {
			avatarURL: 'avatarURL'
		};

		app.save(users);
	},
	(app) => {
		const users = app.findCollectionByNameOrId('users');

		users.fields.remove('avatarURL');
		users.fields.remove('lang');
		users.fields.remove('username');
		users.removeIndex('idx_username_pb_users_auth');

		users.authAlert = true;
		users.passwordAuth.enabled = true;
		users.otp.enabled = false;
		users.oauth2.enabled = false;
		users.oauth2.providers = [];
		users.oauth2.mappedFields = {};

		app.save(users);
	}
);
