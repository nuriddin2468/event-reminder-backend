import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from '../../event/entities/event.entity';
import { Location } from '../../location/entities/location.entity';

@Entity('users')
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  username: string;

  @Column()
  password?: string;

  @Field(() => [Event])
  @OneToMany(() => Event, (event) => event.user)
  events: Event[];

  @Field(() => [Location])
  @OneToMany(() => Location, (location) => location.user)
  locations: Location[];
}
