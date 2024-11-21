import { Field, GraphQLISODateTime, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateEventInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => GraphQLISODateTime)
  startDate: string;

  @Field(() => GraphQLISODateTime)
  endDate: string;

  @Field(() => Int, { nullable: true })
  locationId?: number;
}
