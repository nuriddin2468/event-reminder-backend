import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import { Location } from '../../location/entities/location.entity';

@ObjectType()
export class Event {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => GraphQLISODateTime)
  startDate: string;

  @Field(() => GraphQLISODateTime)
  endDate: string;

  @Field(() => User)
  user: User;

  @Field(() => Location, { nullable: true })
  location?: Location;
}
