import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserSchema } from '../../user/schemas/user.schema';

@ObjectType()
export class AuthSchema {
  @Field(() => UserSchema)
  user: UserSchema;

  @Field()
  token: string;

  @Field(() => Int)
  userId: number;
}
