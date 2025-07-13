const translations = {
	it: {
		'users-otp-login': {
			subject: 'Accesso alla piattaforma',
			greeting: 'Hey, ciao!',
			hereYourOtp: 'Ecco il tuo codice OTP per accedere alla nostra piattaforma: ',
			notRequested: 'Se non hai richiesto questo codice, puoi ignorare questa email.',
			thanks: 'Thanks,',
			signature: 'Il team di '
		}
	},
	en: {
		'users-otp-login': {
			subject: 'Platform Access',
			greeting: 'Hey, hello!',
			hereYourOtp: 'Here is your OTP code to access our platform: ',
			notRequested: 'If you did not request this code, you can ignore this email.',
			thanks: 'Thanks,',
			signature: 'The team of '
		}
	}
};

function getTranslationObject(lang, email) {
	const result = {};
	const translation = translations[lang]?.[email];
	if (!translation) return result;
	Object.entries(translation).forEach(([key, value]) => {
		result[`.${key}`] = value;
	});
	return result;
}

module.exports = {
	translations,
	getTranslationObject
};
