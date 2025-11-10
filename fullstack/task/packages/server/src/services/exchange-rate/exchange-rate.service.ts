import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExchangeRate } from '../../entities';

@Injectable()
export class ExchangeRateService {
    private readonly logger = new Logger(ExchangeRateService.name);
    private readonly CACHE_LIFETIME_MS = 5 * 60 * 1000; // 5 minutes
    private readonly BANK_API_URL =
        'https://www.cnb.cz/en/financial_markets/foreign_exchange_market/exchange_rate_fixing/daily.txt';

    constructor(
        @InjectRepository(ExchangeRate)
        private readonly exchangeRateRepository: Repository<ExchangeRate>
    ) {}

    /**
     * Main method to retrieve exchange rates.
     * Uses cache if fresh; otherwise fetches and updates new data.
     */
    public async getExchangeRates(): Promise<ExchangeRate[]> {
        try {
            console.log('mdaaa');
            const now = new Date();
            const cachedRates = await this.exchangeRateRepository.find();

            if (
                cachedRates.length > 0 &&
                !this.isCacheExpired(cachedRates[0].cacheTimestamp, now)
            ) {
                this.logger.debug('Returning cached exchange rates.');
                return cachedRates;
            }

            this.logger.debug('Cache expired or empty — fetching new data from CNB...');
            const freshRates = await this.fetchExchangeRatesFromBank();

            // Replace old cache atomically
            await this.exchangeRateRepository.clear();
            await this.exchangeRateRepository.save(freshRates);

            this.logger.debug(`Fetched and cached ${freshRates.length} new exchange rates.`);
            return freshRates;
        } catch (error) {
            this.logger.error('Failed to fetch exchange rates', error.stack || error);
            // Fallback: return cached data even if expired
            const fallbackRates = await this.exchangeRateRepository.find();
            if (fallbackRates.length > 0) {
                this.logger.warn('Returning possibly outdated cached data due to fetch error.');
                return fallbackRates;
            }
            throw new Error('Unable to fetch or load cached exchange rates.');
        }
    }

    /**
     * Fetches the latest exchange rates from the Czech National Bank public API.
     */
    private async fetchExchangeRatesFromBank(): Promise<ExchangeRate[]> {
        const response = await axios.get(this.BANK_API_URL, { responseType: 'text' });
        const lines = response.data.split('\n').slice(2).filter(Boolean);

        const now = new Date();

        return lines.map((line: string) => {
            const [country, currency, amount, code, rate] = line.split('|');
            const parsedRate = parseFloat(rate.replace(',', '.')) / Number(amount);

            return this.exchangeRateRepository.create({
                country: country.trim(),
                currency: currency.trim(),
                code: code.trim(),
                rate: parsedRate,
                cacheTimestamp: now,
            });
        });
    }

    /**
     * Determines if cached data is expired based on timestamp.
     */
    private isCacheExpired(cacheTimestamp: Date, now: Date): boolean {
        const cacheAge = now.getTime() - new Date(cacheTimestamp).getTime();
        return cacheAge > this.CACHE_LIFETIME_MS;
    }
}
