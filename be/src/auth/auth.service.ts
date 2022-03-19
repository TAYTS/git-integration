import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findByUsername(username);

    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }
}
