import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Location {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  // it is possible to add coordinates here in future (to connect with maps)
}
