import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';

@ObjectType()
export class Auth {
  @Field(() => User)
  user: User;

  @Field()
  token: string;

  @Field(() => Int)
  userId: number;
}
