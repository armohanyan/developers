export interface ExchangeRate {
    id: string;
    country: string;
    currency: string;
    currencyCode: string;
    amount: number;
    rate: number;
    createdAt: string;
    updatedAt: string;
}

export interface ExchangeRatesData {
    exchangeRates: {
        rates: ExchangeRate[];
        lastUpdated: string;
        isFromCache: boolean;
    };
}
