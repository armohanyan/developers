import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExchangeRateResolver } from './exchange-rate.resolver';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRate } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeRate])],
  providers: [ExchangeRateService, ExchangeRateResolver],
  exports: [ExchangeRateService],
})
export class ExchangeRateModule {}
