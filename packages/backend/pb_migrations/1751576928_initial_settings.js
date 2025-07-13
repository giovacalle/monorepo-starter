/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
	let settings = app.settings();

	settings.meta.appName = $os.getenv('PB_META_APPNAME');
	settings.meta.appURL = $os.getenv('PB_META_APPURL');
	settings.meta.senderAddress = $os.getenv('PB_META_SENDER_ADDRESS');
	settings.meta.senderName = $os.getenv('PB_META_SENDER_NAME');

	const isSmtpEnabled = !!$os.getenv('PB_SMTP_ENABLED');
	settings.smtp.enabled = isSmtpEnabled;
	if (isSmtpEnabled) {
		settings.smtp.host = $os.getenv('PB_SMTP_HOST');
		settings.smtp.port = parseInt($os.getenv('PB_SMTP_PORT') ?? '587', 10);
		settings.smtp.username = $os.getenv('PB_SMTP_USERNAME');
		settings.smtp.password = $os.getenv('PB_SMTP_PASSWORD');
	}

	settings.rateLimits.enabled = true;

	const proxyHeaders = $os.getenv('PB_PROXY_HEADERS');
	if (!!proxyHeaders.trim()) settings.trustedProxy.headers = proxyHeaders.split(',');
	else settings.trustedProxy.headers = [];

	app.save(settings);
});
