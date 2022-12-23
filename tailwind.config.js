/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			animation: {
				wiggle: 'wiggle 2s ease-in infinite',
				textColor: 'textColor 6s ease-in infinite ',
			},
			keyframes: {
				wiggle: {
					'0%, 100%': {transform: 'scale(1)'},
					'50%': {transform: 'scale(1.1)'},
				},
				textColor: {
					'0%, 100%': {
						color: '#fff',
					},
					'50%': {
						color: '#d946ef',
					},
				},
			},
			colors: {
				primary: '#1E90FF',
				secondary: '#FF6347',
				tertiary: '#FFD700',
				ocean: '#1F2937',
			},
		},
	},
	plugins: [],
};
