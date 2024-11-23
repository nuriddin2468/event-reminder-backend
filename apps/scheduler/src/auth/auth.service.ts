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
import { CurrentUserType } from './types/current-user';

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

  async verifyToken(authHeader?: string): Promise<CurrentUserType> {
    if (!authHeader) throw new UnauthorizedException();
    const token = this.extractTokenFromHeader(authHeader);
    if (!token) throw new UnauthorizedException();
    try {
      return (await this.jwtService.verifyAsync(token)) as CurrentUserType;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(authHeader: string): string | undefined {
    const [type, token] = authHeader?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private generateToken(id: number, username: string) {
    return this.jwtService.signAsync({
      id,
      username,
    });
  }
}
