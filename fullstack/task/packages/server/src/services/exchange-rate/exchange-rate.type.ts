import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ExchangeRateType {
  @Field()
  id!: string;

  @Field()
  currencyCode!: string;

  @Field()
  country!: string;

  @Field()
  currency!: string;

  @Field(() => Int)
  amount!: number;

  @Field(() => Float)
  rate!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class ExchangeRatesResponse {
  @Field(() => [ExchangeRateType])
  rates!: ExchangeRateType[];

  @Field()
  lastUpdated!: Date;

  @Field()
  isFromCache!: boolean;
}
