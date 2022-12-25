import currencyReducer from './currencyReducer';

export const initialState = {
	currency: {query: null, message: '', showMessage: false},
};

export const reducer = (state = initialState, action) => {
	return {
		currency: currencyReducer(state.currency, action),
	};
};
