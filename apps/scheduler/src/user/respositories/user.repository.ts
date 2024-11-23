import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as argon from 'argon2';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity) private repository: Repository<UserEntity>,
  ) {}

  findUserById(id: number) {
    return this.repository.findOneOrFail({ where: { id } });
  }

  findUserByUsername(username: string): Promise<UserEntity> {
    return this.repository.findOneOrFail({ where: { username } });
  }

  existUserWithUsername(username: string): Promise<boolean> {
    return this.repository.exists({ where: { username } });
  }

  async create(username: string, password: string): Promise<UserEntity> {
    return this.repository.save({
      username,
      password: await argon.hash(password),
    });
  }
}
