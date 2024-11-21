import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import { Location } from '../../location/entities/location.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'events' })
@ObjectType()
export class Event {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  title: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  description?: string;

  @Column({ type: 'timestamp' })
  @Field(() => GraphQLISODateTime)
  startDate: string;

  @Column({ type: 'timestamp' })
  @Field(() => GraphQLISODateTime)
  endDate: string;

  @ManyToOne(() => User, (user) => user.events)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Location, (location) => location.events, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @Field(() => Location, { nullable: true })
  location?: Location;

  @Field(() => Int, { nullable: true })
  locationId?: number;

  @Field(() => Int)
  userId: number;
}
