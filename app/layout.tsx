import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import {Roboto} from 'next/font/google';
import '../styles/globals.css';
import Providers from './providers';

const roboto = Roboto({
	subsets: ['latin'],
	variable: '--font-roboto',
});

export const metadata: Metadata = {
	title: 'Cryptocurrency',
	description: 'showing list of digital currencies',
	icons: {icon: '/favicon.ico'},
};

export default function RootLayout({children}: {children: ReactNode}) {
	return (
		<html lang='en' className={roboto.variable} suppressHydrationWarning>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
