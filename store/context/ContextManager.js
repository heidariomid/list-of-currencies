import React, {useReducer, useContext, createContext} from 'react';
import {reducer, initialState} from '../reducer/reducer';

export const StateContext = createContext();
export const StateProvider = ({children}) => {
	const defaultValue = useReducer(reducer, initialState);
	return <StateContext.Provider value={defaultValue}>{children}</StateContext.Provider>;
};

export const useStateValue = () => useContext(StateContext);
