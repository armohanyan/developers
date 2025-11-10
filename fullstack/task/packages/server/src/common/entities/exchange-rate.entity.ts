import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ExchangeRate {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 3 })
    currencyCode!: string;

    @Column({ type: 'varchar', length: 100 })
    country!: string;

    @Column({ type: 'varchar', length: 50 })
    currency!: string;

    @Column({ type: 'int' })
    amount!: number;

    @Column({ type: 'decimal', precision: 10, scale: 4 })
    rate!: number;

    @CreateDateColumn({
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt!: Date;

    @UpdateDateColumn({
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt!: Date;
}
