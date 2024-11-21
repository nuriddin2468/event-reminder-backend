import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Location } from '../location/entities/location.entity';
import { Event } from '../event/entities/event.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id);
  }

  @ResolveField(() => [Event])
  events(@Parent() user: User) {}

  @ResolveField(() => [Location])
  locations(@Parent() user: User) {}
}
