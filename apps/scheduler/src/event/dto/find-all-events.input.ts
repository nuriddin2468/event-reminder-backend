import { Field, GraphQLISODateTime, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FindAllEventsInput {
  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  endDate?: string;

  @Field(() => Int, { nullable: true })
  locationId?: number;
}
