import { Injectable, SetMetadata, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { BasicStrategy as Strategy } from 'passport-http';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    username: string,
    password: string,
  ): Promise<User> {
    const user = await this.authService.validateUser(username, password);
    if (user != null) {
      SetMetadata('user', user);
      return user;
    }
    throw new UnauthorizedException();
  }
}
