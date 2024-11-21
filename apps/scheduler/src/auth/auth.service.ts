import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInInput } from './dto/sign-in.input';
import { SignUpInput } from './dto/sign-up.input';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signIn({ username, password }: SignInInput) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await argon.verify(user.password, password))) {
      throw new UnauthorizedException();
    }

    return {
      token: await this.generateToken(user.id, user.username),
      userId: user.id,
    };
  }

  async signUp({ username, password }: SignUpInput) {
    if (await this.userRepository.exists({ where: { username } })) {
      throw new BadRequestException();
    }
    const user = await this.userRepository.save({
      username,
      password: await argon.hash(password),
    });
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
