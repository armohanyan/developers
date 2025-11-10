import { gql } from '@apollo/client';

export const EXCHANGE_RATES_QUERY = gql`
    query GetExchangeRates {
        exchangeRates {
            rates {
                id
                currencyCode
                country
                currency
                amount
                rate
                createdAt
                updatedAt
            }
            lastUpdated
            isFromCache
        }
    }
`;
