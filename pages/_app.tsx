import '../styles/globals.css';
import type {AppProps} from 'next/app';
import {Hydrate, QueryClient, QueryClientProvider} from 'react-query';
import {ThemeProvider} from 'next-themes';

export default function App({Component, pageProps}: AppProps) {
	const queryClient = new QueryClient();
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider enableSystem={true} attribute='class'>
				<Hydrate state={pageProps.dehydratedState}>
					<Component {...pageProps} />
				</Hydrate>
			</ThemeProvider>
		</QueryClientProvider>
	);
}
