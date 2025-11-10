import { Field, Float, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsPositive, IsString, MinLength } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { EntityWithMeta } from '../common';
import { VAR_CHAR } from './constants';

@ObjectType()
@Entity()
export class ExchangeRate extends EntityWithMeta {
    @IsString()
    @MinLength(1)
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public country!: string;

    @IsString()
    @MinLength(1)
    @Field(() => String)
    @Column({ ...VAR_CHAR })
    public currency!: string;

    @IsString()
    @MinLength(3)
    @Field(() => String)
    @Column({ ...VAR_CHAR, length: 3 })
    public code!: string;

    @IsNumber()
    @IsPositive()
    @Field(() => Float)
    @Column('float')
    public rate!: number;

    @Field(() => Date)
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    cacheTimestamp!: Date;
}
