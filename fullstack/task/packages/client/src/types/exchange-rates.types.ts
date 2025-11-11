export interface IExchangeRate {
    id: string;
    country: string;
    currency: string;
    currencyCode: string;
    amount: number;
    rate: number;
    createdAt: string;
    updatedAt: string;
}

export interface IExchangeRatesData {
    exchangeRates: {
        rates: IExchangeRate[];
        lastUpdated: string;
    };
}
