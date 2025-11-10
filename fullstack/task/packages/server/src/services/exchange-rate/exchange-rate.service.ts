import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';

import { ExchangeRatesResponse } from './exchange-rate.type';
import { ExchangeRate } from '../../entities';

@Injectable()
export class ExchangeRateService {
  private readonly CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes
  private readonly CNB_API_URL =
    // eslint-disable-next-line max-len
    'https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt';

  private readonly logger = new Logger(ExchangeRateService.name);

  constructor(
    @InjectRepository(ExchangeRate)
    private readonly exchangeRateRepository: Repository<ExchangeRate>,
  ) {}

  /**
   * Get exchange rates, using cache if valid.
   */
  async getExchangeRates(): Promise<ExchangeRatesResponse> {
    const latestCache = await this.getLatestCacheTime();

    if (!latestCache || this.isCacheExpired(latestCache)) {
      return this.fetchAndCacheRates();
    }

    const cachedRates = await this.getCachedRates();
    return {
      rates: cachedRates,
      lastUpdated: latestCache,
      isFromCache: true,
    };
  }

  /**
   * Check if cache is expired.
   */
  private isCacheExpired(latestCache: Date): boolean {
    const age = Date.now() - latestCache.getTime();
    return age >= this.CACHE_DURATION_MS;
  }

  /**
   * Get all cached rates ordered by creation date.
   */
  private getCachedRates(): Promise<ExchangeRate[]> {
    return this.exchangeRateRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get timestamp of the latest cached record.
   */
  private async getLatestCacheTime(): Promise<Date | null> {
    try {
      const latest = await this.exchangeRateRepository.find({
        order: { createdAt: 'DESC' },
        take: 1,
      });
      return latest.length ? latest[0].createdAt : null;
    } catch (error) {
      this.logger.error('Error fetching latest cache time', error);
      return null;
    }
  }

  /**
   * Fetch exchange rates from CNB, parse and cache them.
   */
  private async fetchAndCacheRates(): Promise<ExchangeRatesResponse> {
    try {
      const { data } = await axios.get(this.CNB_API_URL);
      const rates = this.parseCNBData(data);

      // Clear old rates and save new ones atomically
      await this.exchangeRateRepository.clear();
      const savedRates = await this.exchangeRateRepository.save(rates);

      return {
        rates: savedRates,
        lastUpdated: new Date(),
        isFromCache: false,
      };
    } catch (error) {
      this.logger.error('Error fetching CNB exchange rates', error);

      const cachedRates = await this.getCachedRates();
      const latestCache = await this.getLatestCacheTime();

      return {
        rates: cachedRates,
        lastUpdated: latestCache ?? new Date(),
        isFromCache: true,
      };
    }
  }

  /**
   * Parse CNB text data into ExchangeRate entities.
   */
  private parseCNBData(data: string): Partial<ExchangeRate>[] {
    const lines = data.trim().split('\n').slice(2); // skip header lines
    const rates: Partial<ExchangeRate>[] = [];

    for (const line of lines) {
      if (!line.trim()) continue;

      const [country, currency, amountStr, currencyCode, rateStr] = line.split('|');
      if (!country || !currency || !amountStr || !currencyCode || !rateStr) continue;

      rates.push({
        country: country.trim(),
        currency: currency.trim(),
        amount: parseInt(amountStr.trim(), 10),
        currencyCode: currencyCode.trim(),
        rate: parseFloat(rateStr.trim().replace(',', '.')),
      });
    }

    return rates;
  }
}
