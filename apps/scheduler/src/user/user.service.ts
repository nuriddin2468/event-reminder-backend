import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './respositories/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  findOne(id: number): Promise<UserEntity> {
    return this.userRepository.findUserById(id);
  }

  findUserByUsername(username: string): Promise<UserEntity> {
    return this.userRepository.findUserByUsername(username);
  }

  existUserWithUsername(username: string): Promise<boolean> {
    return this.userRepository.existUserWithUsername(username);
  }

  createUser(username: string, password: string): Promise<UserEntity> {
    return this.userRepository.create(username, password);
  }
}
