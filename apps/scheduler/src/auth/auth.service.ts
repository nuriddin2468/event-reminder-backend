import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInInput } from './dto/sign-in.input';
import { SignUpInput } from './dto/sign-up.input';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn({ username, password }: SignInInput) {
    const user = await this.userService.findUserByUsername(username);
    if (await argon.verify(user.password as string, password)) {
      throw new UnauthorizedException();
    }

    return {
      token: await this.generateToken(user.id, user.username),
      userId: user.id,
    };
  }

  async signUp({ username, password }: SignUpInput) {
    if (await this.userService.existUserWithUsername(username)) {
      throw new BadRequestException();
    }
    const user = await this.userService.createUser(username, password);
    return {
      token: await this.generateToken(user.id, user.username),
      userId: user.id,
    };
  }

  private generateToken(id: number, username: string) {
    return this.jwtService.signAsync({
      id,
      username,
    });
  }
}
