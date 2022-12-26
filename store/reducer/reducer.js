import currencyReducer from './currencyReducer';

export const initialState = {
	currency: {query: null, message: '', showMessage: false, perPage: 10, page: 1},
};

export const reducer = (state = initialState, action) => {
	return {
		currency: currencyReducer(state.currency, action),
	};
};
