/// <reference types="../pb_data/types.d.ts" />

onRecordCreate((e) => {
	const { uniqueNamesGenerator, adjectives, animals, NumberDictionary } = require(
		`${__hooks}/../node_modules/unique-names-generator`
	);

	e.record.set('username', e.record.get('email'));

	try {
		let attempts = 0;
		do {
			const number = NumberDictionary.generate({
				min: 1,
				max: 99999
			});

			const username = uniqueNamesGenerator({
				dictionaries: [adjectives, animals, number],
				length: 3,
				separator: '_',
				style: 'lowercase'
			});

			if (e.app.countRecords('users', $dbx.hashExp({ username })) === 0) {
				e.record.set('username', username);
				break;
			}

			attempts++;

			if (attempts >= 3) {
				e.app.logger().error('Failed to generate a unique username after 3 attempts');
			}
		} while (attempts < 3);
	} catch (err) {
		e.app.logger().error('Error generating unique username');
	}

	e.next();
}, 'users');
