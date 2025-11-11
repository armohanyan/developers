import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';

import { ExchangeRatesResponse } from './exchange-rate.type';
import { CACHE_DURATION_MS, CNB_API_URL } from '../../consts';
import { ExchangeRate } from '../../entities';

@Injectable()
export class ExchangeRateService {
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

    if (!latestCache || this.isCacheExpired(latestCache)) return this.fetchAndCacheRates();

    const cachedRates = await this.getCachedRates();

    return {
      rates: cachedRates,
      lastUpdated: latestCache,
    };
  }

  /**
   * Check if cache is expired.
   */
  private isCacheExpired(latestCache: Date): boolean {
    const age = Date.now() - latestCache.getTime();
    return age >= CACHE_DURATION_MS;
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
      const { data } = await axios.get(CNB_API_URL as string);
      const rates = this.parseCNBData(data);

      // Clear old rates and save new ones atomically
      await this.exchangeRateRepository.clear();
      const savedRates = await this.exchangeRateRepository.save(rates);

      return {
        rates: savedRates,
        lastUpdated: new Date(),
      };
    } catch (error) {
      this.logger.error('Error fetching CNB exchange rates', error);

      const cachedRates = await this.getCachedRates();
      const latestCache = await this.getLatestCacheTime();

      return {
        rates: cachedRates,
        lastUpdated: latestCache ?? new Date(),
      };
    }
  }

  /**
   * Parse CNB text data into ExchangeRate entities.
   */
  private parseCNBData(data: string): Partial<ExchangeRate>[] {
    if (!data) return [];

    return data
      .trim()
      .split('\n')
      .slice(2)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [country, currency, amountStr, currencyCode, rateStr] = line
          .split('|')
          .map((s) => s.trim());

        if (!country || !currency || !amountStr || !currencyCode || !rateStr) {
          return null;
        }

        const amount = Number.parseInt(amountStr, 10);
        const rate = Number.parseFloat(rateStr.replace(',', '.'));

        if (Number.isNaN(amount) || Number.isNaN(rate)) {
          return null;
        }

        return {
          country,
          currency,
          amount,
          currencyCode,
          rate,
        };
      })
      .filter((item) => item !== null) as Partial<ExchangeRate>[];
  }
}
