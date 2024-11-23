import { ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventEntity } from '../../event/entities/event.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({ name: 'locations' })
@ObjectType()
export class LocationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => EventEntity, (event) => event.location)
  events: EventEntity[];

  @ManyToOne(() => UserEntity, (user) => user.locations)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  userId: number;

  // it is possible to add coordinates here in future (to connect with maps)
}
