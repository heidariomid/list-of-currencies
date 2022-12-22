import {QueryFunction} from 'react-query';
import {ICurrencyInfo} from './ICurrencyInfo';

export type IfetchCurrencies = (page?: number, perPage?: number) => QueryFunction<ICurrencyInfo[]>;
