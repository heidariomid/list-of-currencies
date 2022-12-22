/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			animation: {
				wiggle: 'wiggle 2s ease-in infinite',
			},
			keyframes: {
				wiggle: {
					'0%, 100%': {transform: 'scale(1)'},
					'50%': {transform: 'scale(1.1)'},
				},
			},
		},
	},
	plugins: [],
};
