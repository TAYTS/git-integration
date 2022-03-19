import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { RedisRepositoryService } from 'src/common/redis-repository.service';
import { GitController } from './git.controller';
import { GitService } from './git.service';

@Module({
  imports: [HttpModule],
  controllers: [GitController],
  providers: [
    GitService,
    ConfigService,
    PrismaClient,
    RedisRepositoryService,
    Logger,
  ],
})
export class GitModule {}
