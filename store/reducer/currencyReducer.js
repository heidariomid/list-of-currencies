import {actions} from '../actions/actions';
// currency: {query: null, message: '', showMessage: false},
const reducer = (currencyState, action) => {
	let result = currencyState;
	switch (action.type) {
		case actions.SEARCH_CURRENCY:
			result = {...currencyState, query: action.payload.query};
			break;
		case actions.SEARCH_MESSAGE:
			result = {...currencyState, showMessage: action.payload.showMessage, message: action.payload.message};
			break;
		default:
			result = currencyState;
			break;
	}
	return result;
};

export default reducer;
