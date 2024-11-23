import { Field, Int, ObjectType } from '@nestjs/graphql';
import { EventSchema } from '../../event/schemas/event.schema';
import { UserSchema } from '../../user/schemas/user.schema';

@ObjectType()
export class LocationSchema {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field(() => [EventSchema])
  events: EventSchema[];

  @Field(() => UserSchema)
  user: UserSchema;

  @Field(() => Int)
  userId: number;

  // it is possible to add coordinates here in future (to connect with maps)
}
