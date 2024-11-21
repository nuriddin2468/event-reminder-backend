import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from '../../event/entities/event.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'locations' })
@ObjectType()
export class Location {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  title: string;

  @Field(() => [Event])
  @OneToMany(() => Event, (event) => event.location)
  events: Event[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.locations)
  user: User;

  // it is possible to add coordinates here in future (to connect with maps)
}
