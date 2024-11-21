import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EventModule } from '../event/event.module';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => EventModule),
    forwardRef(() => LocationModule),
  ],
  providers: [UserResolver, UserService],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
