import { format } from 'date-fns';

// Using Frankfurter API - Free, supports historical rates since 1999
// Supports: AUD, BGN, BRL, CAD, CHF, CNY, CZK, DKK, EUR, GBP, HKD, HUF, IDR, ILS, INR, ISK, JPY, KRW, MXN, MYR, NOK, NZD, PHP, PLN, RON, SEK, SGD, THB, TRY, USD, ZAR
const API_BASE = 'https://api.frankfurter.app';

// Cache to avoid redundant API calls
const rateCache = new Map();

export const fetchExchangeRate = async (date, baseCurrency, targetCurrency) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const cacheKey = `${dateStr}-${baseCurrency}-${targetCurrency}`;

    if (rateCache.has(cacheKey)) {
        return rateCache.get(cacheKey);
    }

    try {
        // Frankfurter API supports historical rates: /{date}?from={base}&to={target}
        const response = await fetch(
            `${API_BASE}/${dateStr}?from=${baseCurrency}&to=${targetCurrency}`
        );
        const data = await response.json();

        if (data.rates && data.rates[targetCurrency]) {
            const rate = data.rates[targetCurrency];
            rateCache.set(cacheKey, rate);
            return rate;
        }

        throw new Error('Currency not found or date out of range');
    } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
        return null;
    }
};

export const convertAmount = async (amount, date, baseCurrency, targetCurrency) => {
    if (baseCurrency === targetCurrency) return amount;

    const rate = await fetchExchangeRate(date, baseCurrency, targetCurrency);
    return rate ? amount * rate : null;
};

// Supported currencies by Frankfurter API
export const CURRENCIES = [
    'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'MXN',
    'BRL', 'KRW', 'SEK', 'NOK', 'DKK', 'SGD', 'HKD', 'NZD', 'ZAR', 'TRY'
];
