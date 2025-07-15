import { Locale } from '@/shared/types';
import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Text
} from '@react-email/components';
import { baseUrl } from '@/shared/utils';

interface LoginVerificationOtpEmailProps {
	otp: string;
	locale?: Locale;
}
export default function LoginVerificationOtpEmail({
	otp,
	locale = 'en'
}: LoginVerificationOtpEmailProps) {
	return (
		<Html>
			<Head />
			<Body style={main}>
				<Preview>{translation[locale].preview}</Preview>
				<Container style={container}>
					<Section style={coverSection}>
						<Section style={imageSection}>
							<Img
								src={`${baseUrl}/favicon.png`}
								width="75"
								height="45"
								alt="Monorepo Starter's Logo"
							/>
						</Section>
						<Section style={upperSection}>
							<Heading style={h1}>{translation[locale].subject}</Heading>
							<Text style={mainText}>{translation[locale].mainText}</Text>
							<Section style={verificationSection}>
								<Text style={verifyText}>{translation[locale].verificationCodeLabel}</Text>
								<Text style={codeText}>{otp}</Text>
								<Text style={validityText}>{translation[locale].validityText}</Text>
							</Section>
						</Section>
						<Hr />
						<Section style={lowerSection}>
							<Text style={cautionText}>{translation[locale].cautionText}</Text>
						</Section>
					</Section>
					<Text style={footerText}>
						{translation[locale].footerText}
						<Link href={`${baseUrl}/privacy-policy`} target="_blank" style={link}>
							{translation[locale].viewPolicy}
						</Link>
					</Text>
				</Container>
			</Body>
		</Html>
	);
}

LoginVerificationOtpEmail.PreviewProps = {
	otp: '123456',
	locale: 'it'
} satisfies LoginVerificationOtpEmailProps;

const translation = {
	en: {
		preview: 'Monorepo Starter Email Verification',
		subject: 'Verify your email address',
		mainText:
			// eslint-disable-next-line
			"Thanks for starting the new Monorepo Starter account creation process. We want to make sure it's really you. Please enter the following verification code when prompted. If you don't want to create an account, you can ignore this message.",
		verificationCodeLabel: 'Verification code',
		validityText: '(This code is valid for 10 minutes)',
		cautionText:
			'Monorepo Starter will never email you and ask you to disclose or verify your password, credit card, or banking account number.',
		footerText:
			'This message was produced and distributed by Monorepo Starter, Inc. © 2025 All rights reserved.',
		viewPolicy: 'View our privacy policy'
	},
	it: {
		preview: 'Verifica email Monorepo Starter',
		subject: 'Verifica il tuo indirizzo email',
		mainText:
			'Grazie per aver avviato il processo di creazione del nuovo account Monorepo Starter. Vogliamo assicurarci che sia davvero tu. Inserisci il seguente codice di verifica quando richiesto. Se non desideri creare un account, puoi ignorare questo messaggio.',
		verificationCodeLabel: 'Codice di verifica',
		validityText: '(Questo codice è valido per 10 minuti)',
		cautionText:
			'Monorepo Starter non ti invierà mai email chiedendoti di divulgare o verificare la tua password, il numero di carta di credito o il conto bancario.',
		footerText:
			'Questo messaggio è stato prodotto e distribuito da Monorepo Starter, Inc. © 2025 Tutti i diritti riservati.',
		viewPolicy: 'Visualizza la nostra politica sulla privacy'
	}
};

const main = {
	backgroundColor: '#fff',
	color: '#212121'
};

const container = {
	padding: '20px',
	margin: '0 auto',
	backgroundColor: '#eee'
};

const h1 = {
	color: '#333',
	fontFamily:
		'-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
	fontSize: '20px',
	fontWeight: 'bold',
	marginBottom: '15px'
};

const link = {
	color: '#2754C5',
	fontFamily:
		'-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
	fontSize: '14px',
	textDecoration: 'underline'
};

const text = {
	color: '#333',
	fontFamily:
		'-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
	fontSize: '14px',
	margin: '24px 0'
};

const imageSection = {
	backgroundColor: '#252f3d',
	display: 'flex',
	padding: '20px 0',
	alignItems: 'center',
	justifyContent: 'center'
};

const coverSection = { backgroundColor: '#fff' };

const upperSection = { padding: '25px 35px' };

const lowerSection = { padding: '25px 35px' };

const footerText = {
	...text,
	fontSize: '12px',
	padding: '0 20px'
};

const verifyText = {
	...text,
	margin: 0,
	fontWeight: 'bold',
	textAlign: 'center' as const
};

const codeText = {
	...text,
	fontWeight: 'bold',
	fontSize: '36px',
	margin: '10px 0',
	textAlign: 'center' as const
};

const validityText = {
	...text,
	margin: '0px',
	textAlign: 'center' as const
};

const verificationSection = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center'
};

const mainText = { ...text, marginBottom: '14px' };

const cautionText = { ...text, margin: '0px' };
