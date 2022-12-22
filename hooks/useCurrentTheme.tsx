import {useTheme} from 'next-themes';
import {useEffect, useState} from 'react';

// use this hook to get the current theme
export const useCurrentTheme = () => {
	const {theme, setTheme} = useTheme();
	const [mounted, setMounted] = useState(false);
	// When mounted on client, now we can show the UI
	useEffect(() => setMounted(true), []);

	const currentTheme = theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme;

	if (!mounted) return {currentTheme: 'light', theme, setTheme};

	return {currentTheme, theme, setTheme};
};
