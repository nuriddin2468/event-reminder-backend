import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthSchema } from './schemas/auth.schema';
import { SignInInput } from './dto/sign-in.input';
import { SignUpInput } from './dto/sign-up.input';
import { Public } from './decorators/is-public';
import { CurrentUser } from './decorators/current-user';
import { CurrentUserType } from './types/current-user';
import { UserService } from '../user/user.service';
import { UserSchema } from '../user/schemas/user.schema';

@Resolver(() => AuthSchema)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @Mutation(() => AuthSchema)
  signIn(@Args('signInInput') signInInput: SignInInput) {
    return this.authService.signIn(signInInput);
  }

  @Public()
  @Mutation(() => AuthSchema)
  signUp(@Args('signUpInput') signUpInput: SignUpInput) {
    return this.authService.signUp(signUpInput);
  }

  @Query(() => UserSchema)
  me(@CurrentUser() user: CurrentUserType) {
    return user;
  }

  @ResolveField(() => UserSchema)
  user(@Parent() auth: AuthSchema) {
    return this.userService.findOne(auth.userId);
  }
}
