import { Query, Resolver } from '@nestjs/graphql';
import { ExchangeRate } from '../../entities';
import { ExchangeRateService } from './exchange-rate.service';

@Resolver()
export class ExchangeRateResolver {
    constructor(private readonly exchangeRateService: ExchangeRateService) {}

    @Query(() => [ExchangeRate], { nullable: true })
    async exchangeRates() {
        return this.exchangeRateService.getExchangeRates();
    }
}
