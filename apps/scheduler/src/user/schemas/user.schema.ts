import { Field, Int, ObjectType } from '@nestjs/graphql';
import { EventSchema } from '../../event/schemas/event.schema';
import { LocationSchema } from '../../location/schemas/location.schema';

@ObjectType()
export class UserSchema {
  @Field(() => Int)
  id: number;

  @Field()
  username: string;

  @Field(() => [EventSchema])
  events: EventSchema[];

  @Field(() => [LocationSchema])
  locations: LocationSchema[];
}
