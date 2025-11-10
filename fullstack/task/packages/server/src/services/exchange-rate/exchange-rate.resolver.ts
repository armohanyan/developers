import { Query, Resolver } from '@nestjs/graphql';

import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRatesResponse } from './exchange-rate.type';

@Resolver()
export class ExchangeRateResolver {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  @Query(() => ExchangeRatesResponse, { nullable: true })
  async exchangeRates() {
    return this.exchangeRateService.getExchangeRates();
  }
}
