import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaClient: PrismaClient) {}

  async findByUsername(name: string): Promise<User | null> {
    const user = await this.prismaClient.user.findFirst({ where: { name } });

    return user;
  }

  async createUser(payload: CreateUserDto): Promise<User> {
    const { username, password } = payload;

    const existingUser = await this.findByUsername(username);

    if (existingUser) {
      throw new ConflictException('username has taken');
    }

    const hashPassword = bcrypt.hashSync(password, 10);

    const user = await this.prismaClient.user.create({
      data: {
        name: username,
        password: hashPassword,
      },
    });

    return user;
  }
}
