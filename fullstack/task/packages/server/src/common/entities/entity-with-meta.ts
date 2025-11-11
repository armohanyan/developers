import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@ObjectType()
export abstract class EntityWithMeta {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  public createdAtUtc!: Date;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  public updatedAtUtc?: Date;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  public deleteDateUtc?: Date | null;

  @Field(() => Int)
  @VersionColumn()
  public version!: number;
}
