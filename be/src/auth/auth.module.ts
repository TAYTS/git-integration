import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { BasicStrategy } from './auth-basic.strategy';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';

@Module({
  imports: [PassportModule, ConfigModule, UserModule],
  providers: [BasicStrategy, AuthService],
})
export class AuthModule {}
