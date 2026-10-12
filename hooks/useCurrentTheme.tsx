import {useTheme} from 'next-themes';

// use this hook to get the current theme
export const useCurrentTheme = () => {
	const {theme, resolvedTheme, setTheme} = useTheme();

	return {currentTheme: resolvedTheme ?? 'light', theme, setTheme};
};
