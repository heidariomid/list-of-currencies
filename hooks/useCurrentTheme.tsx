'use client';

import {useEffect, useState} from 'react';
import {useTheme} from 'next-themes';

// resolvedTheme is wrong on the server. Wait until mount so the switch matches the saved theme.
export const useCurrentTheme = () => {
	const {theme, resolvedTheme, setTheme} = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return {
		currentTheme: mounted ? (resolvedTheme ?? 'light') : undefined,
		theme,
		setTheme,
	};
};
