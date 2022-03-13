import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CommonModule } from 'src/common/common.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [CommonModule],
  controllers: [UserController],
  providers: [UserService, PrismaClient],
  exports: [UserService],
})
export class UserModule {}
