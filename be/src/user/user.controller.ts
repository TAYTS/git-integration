import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { CreateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('basic'))
  async getUser(username: string): Promise<User> {
    const user = await this.userService.findByUsername(username);

    return user;
  }

  @Post()
  async createUser(@Body() payload: CreateUserDto): Promise<User> {
    const newUser = await this.userService.createUser(payload);

    return newUser;
  }
}
