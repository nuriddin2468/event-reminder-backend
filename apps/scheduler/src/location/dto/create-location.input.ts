import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateLocationInput {
  @Field()
  title: string;
}
