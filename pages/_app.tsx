import '../styles/globals.css';
import type {AppProps} from 'next/app';
import {Hydrate, QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ThemeProvider} from 'next-themes';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {StateProvider} from '../store/context/ContextManager';
export default function App({Component, pageProps}: AppProps) {
	const queryClient = new QueryClient();
	return (
		<ThemeProvider attribute='class'>
			<StateProvider>
				<QueryClientProvider client={queryClient}>
					<Hydrate state={pageProps.dehydratedState}>
						<Component {...pageProps} />
					</Hydrate>
					<ReactQueryDevtools />
				</QueryClientProvider>
			</StateProvider>
		</ThemeProvider>
	);
}
