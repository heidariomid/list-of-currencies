'use client';

import {useState, type ReactNode} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {ThemeProvider} from 'next-themes';
import {StateProvider} from '../store/context/ContextManager';

export default function Providers({children}: {children: ReactNode}) {
	const [queryClient] = useState(() => new QueryClient());
	return (
		<ThemeProvider attribute='class'>
			<StateProvider>
				<QueryClientProvider client={queryClient}>
					{children}
					{process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
				</QueryClientProvider>
			</StateProvider>
		</ThemeProvider>
	);
}
