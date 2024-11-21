import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { SignInInput } from './dto/sign-in.input';
import { SignUpInput } from './dto/sign-up.input';
import { Public } from './decorators/is-public';
import { CurrentUser } from './decorators/current-user';
import { CurrentUserType } from './types/current-user';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @Mutation(() => Auth)
  signIn(@Args('signInInput') signInInput: SignInInput) {
    return this.authService.signIn(signInInput);
  }

  @Public()
  @Mutation(() => Auth)
  signUp(@Args('signUpInput') signUpInput: SignUpInput) {
    return this.authService.signUp(signUpInput);
  }

  @Query(() => User)
  me(@CurrentUser() user: CurrentUserType) {
    return user;
  }

  @ResolveField(() => User)
  user(@Parent() auth: Auth) {
    return this.userService.findOne(auth.userId);
  }
}
