/// <reference types="../pb_data/types.d.ts" />

onMailerRecordOTPSend((e) => {
	const { translations } = require(`${__hooks}/_translations.js`);

	const html = $template.loadFiles(`${__hooks}/views/emails/users-otp-login.html`).render({
		appName: e.app.settings().meta.appName,
		otp: e.meta.password,
		...translations[e.record.lang ?? 'en']['users-otp-login']
	});

	e.message.subject = translations[e.record.lang ?? 'en']['users-otp-login'].subject;
	e.message.html = html;

	e.next();
});
