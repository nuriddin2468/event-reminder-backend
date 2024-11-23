import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { LocationSchema } from '../../location/schemas/location.schema';
import { UserSchema } from '../../user/schemas/user.schema';

@ObjectType()
export class EventSchema {
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

  @Field(() => UserSchema)
  user: UserSchema;

  @Field(() => LocationSchema, { nullable: true })
  location?: LocationSchema;
}
